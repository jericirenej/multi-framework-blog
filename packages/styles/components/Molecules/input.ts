import tw from "../../private";

const wrapperClass = "input-wrapper";
const wrapper = tw`${wrapperClass} relative mt-2 bg-inherit`;
const inputElementClass = "input-element";
const input = tw`${inputElementClass} peer inline-block rounded border-1 border-neutral-400 p-1.5 placeholder-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-75 aria-invalid:outline-2 aria-invalid:outline-red-600 aria-invalid:outline-solid`;
const label = tw`absolute -top-2 left-2.5 z-10 inline-block cursor-text bg-white text-xs text-neutral-700 peer-placeholder-shown:top-[8.5px] peer-placeholder-shown:text-sm peer-focus-visible:-top-2 peer-focus-visible:text-xs peer-disabled:select-none`;

export default { wrapper, input, inputElementClass, label, wrapperClass };
