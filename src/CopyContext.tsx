import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

const CopyContext = createContext<
  [string | null, Dispatch<SetStateAction<string | null>>]
>([null, () => null]);

export default CopyContext;
