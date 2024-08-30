'use client';

import type { User } from "@/app/types/User";
import type { ReactTagInput } from "@/app/types/ReactTagInput";
import { useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { SubmitButton } from "@/app/components/atoms/SubmitButton";
import { updateTags } from "@/app/lib/actions";


export const UserTagsForm = ({ user }: {user: User}) => {
  const formattedTags = user.tags.map(tag => ({
    id: String(tag.id), // id を文字列に変換
    text: tag.name, // name を text に変換
    className: "",
  }));

  const [isHidden, setIsHidden] = useState(true);

  const [tags, setTags] = useState<Array<ReactTagInput>>(formattedTags);
  const tagsString = tags.map(tag => tag.text).join(",");

  const handleSubmit = () => {
    updateTags(user.id, tagsString);
    setIsHidden(true);
  };

  const handleDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onTagUpdate = (index: number, newTag: any) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1, newTag);
    setTags(updatedTags);
  };

  const handleAddition = (tag: any) => {
    setTags((prevTags) => {
      return [...prevTags, tag];
    });
  };

  const handleDrag = (tag: any, currPos: number, newPos: number) => {
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
    <div>
      <button
        type="button"
        onClick={() => setIsHidden(!isHidden)}
        className="bg-black text-white border rounded-lg px-2 py-1 font-bold mt-2 hover:opacity-70"
      >
        {isHidden ? <><i className="bi bi-tag"></i> タグを付ける</> : "キャンセル"}
      </button>
      <form action={handleSubmit} className={`${isHidden && "hidden"} h-full`}>
        <ReactTags
          tags={tags}
          inputFieldPosition="top"
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          autoFocus={false}
          onTagUpdate={onTagUpdate}
          classNames={{
            tag: "bg-black text-white p-1 mr-1",
            tagInputField: "border w-full p-2 mt-2",
            remove: "ml-1",
            tags: "tagsClass",
            tagInput: "tagInputClass",
            selected: "selectedClass",
            suggestions: "suggestionsClass",
            activeSuggestion: "activeSuggestionClass",
            editTagInput: "editTagInputClass",
            editTagInputField: "editTagInputField",
            clearAll: "clearAllClass",
          }}
          maxLength={10}
          placeholder="文字を入力し、エンターキーを押すとタグが作れます。最大5個、10文字以内で入力してください。"
          editable
          clearAll
          onClearAll={onClearAll}
          maxTags={5}
          allowAdditionFromPaste
        />

        <SubmitButton
          className="w-full p-2 mt-2 bg-black text-white hover:opacity-70"
        >
          保存する
        </SubmitButton>
      </form>
    </div>
  );
};
