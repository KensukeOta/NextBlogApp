'use client';

import type { PostState } from "@/app/lib/actions";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useFormState } from "react-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import { WithContext as ReactTags } from "react-tag-input";
import { createPost } from "@/app/lib/actions";
import { SubmitButton } from "@/app/components/atoms/SubmitButton";


export const PostForm = () => {
  const session = useSession();

  const initialState: PostState = { message: "", errors: {} };
  const [state, formAction] = useFormState(createPost, initialState);

  const [tags, setTags] = useState([
    { id: "India", text: "India", className: "" },
    { id: "Vietnam", text: "Vietnam", className: "" },
    { id: "Turkey", text: "Turkey", className: "" },
  ]);

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

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
  };

  const tagsString = tags.map(tag => tag.text).join(",");

  return (
    <form action={formAction} className="h-full">
      <div className="h-full w-full px-4 py-3">
        <div id="create-error" aria-live="polite" aria-atomic="true">
          {state?.message &&
            <p className="text-red-500">
              {state.message}
            </p>
          }
        </div>

        <div id="title-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.title &&
            state.errors.title.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        
        <div>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            placeholder="タイトル"
            onChange={handleInputChange(setTitle)}
            className="block w-full border p-2"
          />
        </div>

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
        <input type="hidden" name="tags" value={tagsString} />

        <div id="body-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.body &&
            state.errors.body.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        <div className="h-[calc(100%-19.969rem)] mt-2">
          <div className="flex h-full">
            <textarea
              name="body"
              id="body"
              placeholder="本文"
              value={body}
              onChange={handleInputChange(setBody)}
              className="flex-1 h-full bg-gray-200 p-2"
            />
            <div className="flex-1 bg-white p-2">
              <Markdown remarkPlugins={[remarkGfm]} className="markdown-body">{body}</Markdown>
            </div>
          </div>
        </div>

        <input type="hidden" name="user_id" defaultValue={session.data?.user?.id} />
        <div id="user-id-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.user_id &&
            state.errors.user_id.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <SubmitButton className="w-full p-2 mt-2 bg-black text-white hover:opacity-70">
          投稿する
        </SubmitButton>
      </div>
    </form>
  );
};
