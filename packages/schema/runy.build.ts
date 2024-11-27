import { buildfile } from "@runy-build/schema";
import { runySDKLibrary } from "@runy-build/self/library";

const mod = buildfile(import.meta);
export const schema = runySDKLibrary(mod);

mod.default(schema);
