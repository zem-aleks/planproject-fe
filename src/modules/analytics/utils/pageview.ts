export const GA_TRACKING_ID = 'G-KPVZG9SX3X';

export const pageview = (url: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
