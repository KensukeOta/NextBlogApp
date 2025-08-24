import type { User } from "@/app/types/User";

export const UserSNSProfile = ({ user }: { user: User }) => {
  const twitterURL = user.user_social_profiles.find(
    (profile) => profile.provider === "twitter",
  )?.url;

  const instagramURL = user.user_social_profiles.find(
    (profile) => profile.provider === "instagram",
  )?.url;

  const youtubeURL = user.user_social_profiles.find(
    (profile) => profile.provider === "youtube",
  )?.url;

  return (
    <div className="dark:bg-background rounded-lg border border-blue-100 bg-white p-6 dark:border-blue-900">
      <h3 className="text-2xl leading-none font-semibold text-blue-800">SNS</h3>

      <div className="mt-6 space-y-3">
        {twitterURL && (
          <a
            href={twitterURL}
            target="_blank"
            className="flex items-center text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <i className="bi bi-twitter-x mr-2"></i>
            <span className="text-sm">X (Twitter)</span>
            <i className="bi bi-box-arrow-up-right ml-1 text-xs"></i>
          </a>
        )}
        {instagramURL && (
          <a
            href={instagramURL}
            target="_blank"
            className="flex items-center text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300"
          >
            <i className="bi bi-instagram mr-2"></i>
            <span className="text-sm">Instagram</span>
            <i className="bi bi-box-arrow-up-right ml-1 text-xs"></i>
          </a>
        )}
        {youtubeURL && (
          <a
            href={youtubeURL}
            target="_blank"
            className="flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <i className="bi bi-youtube mr-2"></i>
            <span className="text-sm">YouTube</span>
            <i className="bi bi-box-arrow-up-right ml-1 text-xs"></i>
          </a>
        )}
      </div>
    </div>
  );
};
