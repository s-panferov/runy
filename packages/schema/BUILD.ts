import { getPackage } from "@runy-build/schema";
import { runySDKLibrary } from "@runy-build/self/library";

const mod = getPackage(import.meta);
export const schema = runySDKLibrary(mod);

mod.default(schema);
