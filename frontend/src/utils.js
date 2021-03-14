export const thumb_name = (orig_file_name) => {
  const arr = orig_file_name.split(".");
  const lst_idx = arr.length - 1;
  return arr.slice(0, lst_idx).join() + "-thumb." + arr.slice(lst_idx);
};
