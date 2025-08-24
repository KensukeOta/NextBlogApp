"use client";

import type { ReactTagInput } from "@/app/types/ReactTagInput";
import { useActionState, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import { WithContext as ReactTags } from "react-tag-input";
import { createPost, PostState } from "@/app/lib/actions/posts";

export const PostForm = () => {
  const initialState: PostState = { message: null, errors: {}, values: {} };
  const [state, formAction, isPending] = useActionState(createPost, initialState);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [tags, setTags] = useState<Array<ReactTagInput>>([]);

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

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
    };

  return (
    <form action={formAction} className="h-full">
      <div id="create-error" aria-live="polite" aria-atomic="true">
        {state?.message && <p className="text-red-500">{state.message}</p>}
      </div>

      <div id="title-error" aria-live="polite" aria-atomic="true">
        {state?.errors?.title &&
          state.errors.title.map((error: string) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
      <input
        type="text"
        name="title"
        id="title"
        placeholder="タイトル"
        aria-describedby="title-error"
        required
        value={title}
        onChange={handleInputChange(setTitle)}
        className="dark:bg-background w-full border bg-white p-2"
      />

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
          tag: "bg-black text-white p-1 mr-1 border",
          tagInputField: "border w-full p-2 mt-2 bg-white dark:bg-background",
          remove: "ml-1 hover:cursor-pointer",
          tags: "tagsClass",
          tagInput: "tagInputClass",
          selected: "selectedClass",
          suggestions: "suggestionsClass",
          activeSuggestion: "activeSuggestionClass",
          editTagInput: "editTagInputClass",
          editTagInputField: "editTagInputField",
          clearAll: "hover:cursor-pointer",
        }}
      />
      <input type="hidden" name="tags" value={JSON.stringify(tagsArray)} />

      <div className="mt-2 h-[calc(100%-11.75rem)]">
        <div id="content-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.content &&
            state.errors.content.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        <div className="flex h-full">
          <textarea
            name="content"
            id="content"
            placeholder="本文"
            aria-describedby="content-error"
            required
            value={content}
            onChange={handleInputChange(setContent)}
            className="h-full flex-1 bg-gray-200 p-2 dark:bg-gray-900"
          />

          <div className="markdown-body dark:bg-background !text-foreground !bg-background flex-1 p-2">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="dark:bg-background mt-2 w-full bg-black p-2 text-white hover:cursor-pointer hover:opacity-70 disabled:cursor-default dark:text-blue-400 dark:hover:bg-slate-800 dark:hover:text-blue-300"
      >
        投稿する
      </button>
    </form>
  );
};
