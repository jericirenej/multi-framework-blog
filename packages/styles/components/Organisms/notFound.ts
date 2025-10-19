import tw from "../../private";

const wrapper = tw`grid w-[60ch] grid-cols-[12ch_2px_25ch] gap-4`;
const heading = {
  wrapper: tw`flex items-center justify-center`,
  errorCode: tw`p-2 text-6xl font-light text-cyan-800 uppercase`,
};

const separator = tw`"h-full w-[2px] bg-neutral-400`;

const info = {
  wrapper: tw`flex flex-col gap-2`,
  text: tw`text-xl text-cyan-800 uppercase`,
  link: tw`underline`,
};

export default { wrapper, heading, separator, info };
