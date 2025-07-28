"use client";

import type { User } from "@/app/types/User";
import type { ReactTagInput } from "@/app/types/ReactTagInput";
import { useActionState, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { updateUser, UserState } from "@/app/lib/actions/users";

export const UserInfoForm = ({ user, onCloseModal }: { user: User; onCloseModal: () => void }) => {
  const initialState: UserState = { message: null, errors: {}, values: {} };
  const updateUsereWithId = updateUser.bind(null, user.id);
  const [state, formAction, isPending] = useActionState(updateUsereWithId, initialState);
  const formattedTags = user.tags.map((tag) => ({
    id: String(tag.id), // id を文字列に変換
    text: tag.name, // name を text に変換
    className: "",
  }));

  const [tags, setTags] = useState<Array<ReactTagInput>>(formattedTags);

  const tagsArray = tags.map((tag) => tag.text);

  const handleDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onTagUpdate = (index: number, newTag: ReactTagInput) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1, newTag);
    setTags(updatedTags);
  };

  const handleAddition = (tag: ReactTagInput) => {
    setTags((prevTags) => {
      return [...prevTags, tag];
    });
  };

  const handleDrag = (tag: ReactTagInput, currPos: number, newPos: number) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index: number) => {
    console.log("The tag at index " + index + " was clicked");
  };

  const onClearAll = () => {
    setTags([]);
  };
  return (
    <form
      action={formAction}
      className="space-y-6"
      id="edit-panel-basic"
      aria-labelledby="edit-tab-user-info"
      role="tabpanel"
    >
      {state?.message && <p className="text-red-500">{state.message}</p>}

      <div className="space-y-2">
        <label
          htmlFor="tag"
          className="inline-block text-sm leading-none font-medium text-blue-800"
        >
          タグ
        </label>
        <ReactTags
          tags={tags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          onTagUpdate={onTagUpdate}
          inputFieldPosition="top"
          autoFocus={false}
          editable
          clearAll
          onClearAll={onClearAll}
          maxTags={5}
          maxLength={10}
          placeholder="文字を入力し、エンターキーを押すとタグが作れます。最大5個、10文字以内で入力してください。"
          classNames={{
            tag: "bg-black text-white p-1 mr-1",
            tagInputField: "border w-full p-2 mt-2 bg-white",
            remove: "ml-1 hover:cursor-pointer text-xl",
            tags: "tagsClass",
            tagInput: "tagInputClass",
            selected: "selectedClass",
            suggestions: "suggestionsClass",
            activeSuggestion: "activeSuggestionClass",
            editTagInput: "editTagInputClass",
            editTagInputField: "editTagInputField",
            clearAll: "hover:cursor-pointer",
          }}
          id="tag"
        />
        <input type="hidden" name="tags" value={JSON.stringify(tagsArray)} />

        <p className="text-sm text-slate-500">得意な言語や興味のある技術を入力してください</p>

        <input type="hidden" name="name" value={user.name} />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCloseModal}
          className="ring-offset-background focus-visible:ring-ring bg-background inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-200 px-4 py-2 text-sm font-medium whitespace-nowrap text-blue-700 transition-colors hover:cursor-pointer hover:bg-blue-50 hover:text-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:cursor-pointer hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          変更を保存
        </button>
      </div>
    </form>
  );
};
