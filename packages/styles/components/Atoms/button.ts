import tw from "../../private";

const baseClass = tw`min-w-[7ch] border-1 outline-hidden cursor-pointer rounded-md no-underline decoration-1 underline-offset-4 outline-offset-2 outline-transparent transition-all duration-50 focus-visible:underline focus-visible:outline-2 focus-visible:shadow-xs disabled:opacity-75 disabled:cursor-not-allowed`;
const variantClasses = {
  confirm: tw`border-green-700 bg-green-50 text-green-700 decoration-green-700 shadow-green-600/20`,
  warning: tw`border-red-700 bg-red-100 text-red-700 decoration-red-700 shadow-red-600/20`,
  cancel: tw`border-neutral-700 bg-neutral-100 text-neutral-700 decoration-neutral-700 shadow-neutral-600/20`,

  info: tw`border-violet-700 bg-violet-100 text-violet-700 decoration-violet-700 shadow-violet-600/20`,
};

const sizeClasses = {
  sm: tw`text-sm px-3 py-2`,
  md: tw`text-md px-3 py-2`,
  lg: tw`text-[18px] px-3 py-3`,
};

const activeClasses = tw`active:scale-96 [.active]:scale-96 disabled:[.active]:scale-100 disabled:[.active]:shadow-none active:shadow-xs [.active]:shadow-xs disabled:active:scale-100 disabled:active:shadow-none`;

export default { baseClass, variantClasses, sizeClasses, activeClasses };
