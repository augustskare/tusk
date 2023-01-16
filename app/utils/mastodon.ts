export declare namespace Mastodon {
  interface Toot {
    id: string;
    created_at: string;
    in_reply_to_id: null;
    in_reply_to_account_id: null;
    sensitive: boolean;
    spoiler_text: string;
    visibility: "public" | string;
    language: string | null;
    uri: string;
    url: string | null;
    replies_count: number;
    reblogs_count: number;
    favourites_count: number;
    edited_at: string | null;
    favourited: boolean;
    reblogged: boolean;
    muted: boolean;
    bookmarked: boolean;
    content: string;
    filtered: [];
    reblog: Toot | null;
    account: Account;
    media_attachments: Attachment[];
    mentions: [];
    tags: {
      name: string;
      url: string;
    }[];
    emojis: Emoji[];
    card: {
      url: string;
      title: string;
      description: string;
      type: string;
      author_name: string;
      author_url: string;
      provider_name: string;
      provider_url: string;
      html: string;
      width: number;
      height: number;
      image: string | null;
      embed_url: string;
      blurhash: string | null;
    } | null;
    poll: {
      id: string;
      expires_at: string;
      expired: boolean;
      multiple: boolean;
      votes_count: number;
      voters_count: number;
      voted: boolean;
      own_votes: [];
      options: { title: string; vote_count: number }[];
      emojis: Emoji[];
    } | null;
  }

  interface Meta {
    width: number;
    height: number;
    size: string;
    aspect: number;
  }

  type Emoji = {
    shortcode: string;
    url: string;
    static_url: string;
    visible_in_picker: string;
  };

  interface Account {
    id: string;
    username: string;
    acct: string;
    display_name: string;
    locked: boolean;
    bot: boolean;
    discoverable: boolean;
    group: boolean;
    created_at: string;
    note: string;
    url: string;
    avatar: string;
    avatar_static: string;
    header: string;
    header_static: string;
    followers_count: number;
    following_count: number;
    statuses_count: number;
    last_status_at: string;
    emojis: Emoji[];
    fields: { name: string; value: string; verified_at: string | null }[];
  }

  interface AttachmentBase {
    id: string;
    url: string;
    preview_url: string;
    remote_url: string;
    preview_remote_url: null;
    text_url: null;
    description: string | null;
    blurhash: string;
  }

  interface AttachmentImage extends AttachmentBase {
    type: "image";
    meta: {
      focus: {
        x: number;
        y: number;
      };
      original: Meta;
      small: Meta;
    };
  }

  interface AttachmentVideo extends AttachmentBase {
    type: "video";
    meta: {
      original: {
        width: number;
        height: number;
        frame_rate: string;
        duration: number;
        bitrate: number;
      };
      small: Meta;
    };
  }

  interface AttachmentGifv extends AttachmentBase {
    type: "gifv";
    meta: {
      focus: {
        x: number;
        y: number;
      };
      original: {
        width: number;
        height: number;
        frame_rate: string;
        duration: number;
        bitrate: number;
      };
      small: Meta;
    };
  }

  interface AttachmentAudio extends AttachmentBase {
    type: "audio";
    meta: {
      length: string;
      duration: number;
      audio_encode: string;
      audio_bitrate: string;
      audio_channels: string;
      original: {
        duration: number;
        bitrate: number;
      };
    };
  }

  type Attachment =
    | AttachmentImage
    | AttachmentVideo
    | AttachmentGifv
    | AttachmentAudio;

  interface Tag {
    name: string;
    url: string;
    history: {
      day: string;
      uses: string;
      accounts: string;
    }[];
    following?: boolean;
  }
}
