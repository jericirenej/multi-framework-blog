import tw from "../../private";

const contentWrapper = tw`flex`;
export const spinnerTransition = tw`w-auto scale-x-100 pl-4 opacity-100 transition-all duration-300 ease-in-out starting:scale-x-0 starting:pl-0 starting:opacity-0`;

export default { contentWrapper, spinnerTransition };
