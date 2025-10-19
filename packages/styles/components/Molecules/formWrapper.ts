import tw from "../../private";

const wrapper = tw`flex w-fit flex-col items-center gap-3`;
const form = tw`flex flex-col items-center gap-5`;
const formActionWrapper = tw`flex gap-4`;
const status = {
  wrapper: tw`mt-2 flex justify-center`,
  successText: tw`text-xs text-green-600`,
  errorText: tw`text-xs text-red-600`,
};

export default { wrapper, form, formActionWrapper, status };
