import type { Meta, StoryObj } from '@storybook/react';

import { PostDeleteButton } from './PostDeleteButton';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  component: PostDeleteButton,
} satisfies Meta<typeof PostDeleteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: { post: { id: 1, title: "test", body: "test", user_id: 1, user: { id: 1, name: "test", email: "test@example.com", password: "test", password_confirmation: "test" } } }
};
