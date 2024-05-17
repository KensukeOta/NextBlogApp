import { auth } from "@/auth";

export const PostForm = async () => {
  const session = await auth()
  
  return (
    <form action="" className="h-full flex items-center justify-center text-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">タイトル</label>
          <input type="text" name="title" id="title" className="block w-full border p-2" />
        </div>

        <div className="mb-4">
          <label htmlFor="body" className="block mb-2">本文</label>
          <textarea name="body" id="body" className="block w-full border p-2" />
        </div>

        <input type="hidden" name="user_id" value={session?.user?.id} />

        <button
          type="submit"
          className="w-full mt-4 p-2 bg-black text-white hover:opacity-70"
        >
          投稿する
        </button>
      </div>
    </form>
  );
};
