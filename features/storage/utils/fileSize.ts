export const fileSize = (size: string | number) => {
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let l = 0,
    n = typeof size === "string" ? parseInt(size, 10) || 0 : size;
  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
};
