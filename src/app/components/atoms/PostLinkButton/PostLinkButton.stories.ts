import type { Meta, StoryObj } from '@storybook/react';

import { PostLinkButton } from './PostLinkButton';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  component: PostLinkButton,
} satisfies Meta<typeof PostLinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {

};
