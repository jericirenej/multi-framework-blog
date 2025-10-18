import tw from "../../private";

const outerWrapper = tw`max-w-prose min-w-[50ch] text-neutral-700`;
const innerWrapper = tw`flex h-[22px] items-center`;
const innerWrapperOwnPost = tw`${innerWrapper} justify-between`;

const date = { wrapper: tw`flex justify-end`, span: tw`text-xs` };
const actions = {
  wrapper: tw`flex h-[inherit] gap-3`,
  editIcon: tw`text-cyan-800`,
  deleteButton: tw`cursor-pointer text-red-700 saturate-75`,
};
const post = {
  wrapper: tw`mb-5 flex flex-col items-center`,
  heading: tw`text-2xl font-light text-amber-900`,
  author: tw`text-sm`,
  content: tw`text-wrapper relative mb-3 line-clamp-3 text-left text-black`,
};

export default {
  outerWrapper,
  innerWrapper,
  innerWrapperOwnPost,
  date,
  actions,
  post,
};
