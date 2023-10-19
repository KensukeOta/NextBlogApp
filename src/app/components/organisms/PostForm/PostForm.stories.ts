import type { Meta, StoryObj } from '@storybook/react';

import { PostForm } from './PostForm';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  component: PostForm,
} satisfies Meta<typeof PostForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {

};
