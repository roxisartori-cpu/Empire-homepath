import convert from 'html-to-jsx';
import * as cheerio from 'cheerio';

const isExternalHref = (href) => /^(https?:|mailto:|tel:)/i.test(href);

const normalizeLinkTo = (href) => {
  if (href.startsWith('#')) return `/${href}`;
  return href;
};

export function transformHtmlLinks(html) {
  const $ = cheerio.load(html, { decodeEntities: false }, false);

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href || href === '#' || isExternalHref(href)) return;
    if (!href.startsWith('/') && !href.startsWith('#')) return;

    const $link = $('<react-link></react-link>');
    $link.attr('to', normalizeLinkTo(href));

    const attribs = el.attribs || {};
    for (const [key, value] of Object.entries(attribs)) {
      if (key === 'href') continue;
      $link.attr(key, value);
    }

    $link.html($(el).html() ?? '');
    $(el).replaceWith($link);
  });

  return $.html();
}

function wrapInlineHandler(handler, reactEvent) {
  const trimmed = handler.trim().replace(/\b__spaNavigate\b/g, 'window.__spaNavigate');
  const needsEvent = /\bevent\b/.test(trimmed);
  const evalBody = needsEvent
    ? `(function(event) { ${trimmed} }).call(window, event)`
    : `(0, eval)(${JSON.stringify(trimmed)})`;
  return needsEvent
    ? ` ${reactEvent}={(event) => { try { ${evalBody} } catch (e) { /* noop */ } }}`
    : ` ${reactEvent}={() => { try { ${evalBody} } catch (e) { /* noop */ } }}`;
}

function selfCloseVoidElements(jsx) {
  const voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
  for (const tag of voidTags) {
    jsx = jsx.replace(new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi'), `<${tag}$1 />`);
  }
  return jsx;
}

function extractInlineStyleTags(html) {
  const styles = [];
  const withoutStyles = html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (_, attrs, css) => {
    const id = styles.length;
    styles.push({ attrs: attrs || '', css: css.trim() });
    return `<span data-inline-style="${id}"></span>`;
  });
  return { html: withoutStyles, styles };
}

function inlineStylesToJsx(jsx, styles) {
  return jsx.replace(/<span data-inline-style="(\d+)"><\/span>/g, (_, id) => {
    const style = styles[Number(id)];
    if (!style) return '';
    const escaped = style.css.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    return `<style${style.attrs} dangerouslySetInnerHTML={{ __html: \`${escaped}\` }} />`;
  });
}

export function htmlToJsx(html) {
  const { html: htmlWithoutStyles, styles } = extractInlineStyleTags(html);
  let jsx = convert(htmlWithoutStyles);
  jsx = inlineStylesToJsx(jsx, styles);
  jsx = selfCloseVoidElements(jsx);
  jsx = jsx.replace(/<react-link/g, '<Link').replace(/<\/react-link>/g, '</Link>');

  jsx = jsx.replace(/\sonclick="([^"]+)"/gi, (_, handler) => wrapInlineHandler(handler, 'onClick'));
  jsx = jsx.replace(/\sonClick="([^"]+)"/g, (_, handler) => wrapInlineHandler(handler, 'onClick'));
  jsx = jsx.replace(/\sonchange="([^"]+)"/gi, (_, handler) => wrapInlineHandler(handler, 'onChange'));
  jsx = jsx.replace(/\sonChange="([^"]+)"/g, (_, handler) => wrapInlineHandler(handler, 'onChange'));
  jsx = jsx.replace(/\soninput="([^"]+)"/gi, (_, handler) => wrapInlineHandler(handler, 'onInput'));
  jsx = jsx.replace(/\sonInput="([^"]+)"/g, (_, handler) => wrapInlineHandler(handler, 'onInput'));

  return jsx;
}

function escapeTemplate(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function normalizePageContent(page) {
  const popKeyframes = '@keyframes pop{from{transform:scale(0);}to{transform:scale(1);}}';
  let { html, css } = page;
  if (html.includes(popKeyframes)) {
    html = html.replace(popKeyframes, '');
    if (!css.includes('@keyframes pop')) {
      css += `\n${popKeyframes}`;
    }
  }
  return { ...page, html, css };
}

export function buildStaticPageComponent({ component, page: rawPage }) {
  const page = normalizePageContent(rawPage);
  const transformedHtml = transformHtmlLinks(page.html);
  const bodyJsx = htmlToJsx(transformedHtml);
  const cssBlock = page.css
    ? `\n      <style dangerouslySetInnerHTML={{ __html: \`${escapeTemplate(page.css)}\` }} />`
    : '';
  const scriptsBlock = page.scripts
    ? `\nconst PAGE_SCRIPTS = \`${escapeTemplate(page.scripts)}\`;`
    : '\nconst PAGE_SCRIPTS = "";';

  return `import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStaticPageScript } from './useStaticPageScript';
${scriptsBlock}

const ${component} = () => {
  const containerRef = useRef(null);
  useStaticPageScript({
    title: ${JSON.stringify(page.title)},
    scripts: PAGE_SCRIPTS,
    containerRef,
  });

  return (
    <div
      ref={containerRef}
      className="static-page-wrapper"
      style={{ minHeight: '100vh', background: '#0A1628' }}
    >${cssBlock}
${bodyJsx.split('\n').map((line) => `      ${line}`).join('\n')}
    </div>
  );
};

export default ${component};
`;
}
