import { join } from "path";
import { execFile } from "child_process";

export const flaskConnect = (root: string) => {
  const flask = join(root, "../../Resources/Kirana Server");
  return execFile(flask, {
    windowsHide: true,
  });
};
