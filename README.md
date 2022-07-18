# Install the package
```
npm install instagram-apis
```

# Authinication with username and password

```javascript
const lib = require("instagram-apis");
const client = new lib();
(
    async () => {
        await client.init({
            username: "USERNAME",
            password: "PASSWORD"
        })
    }
)();
```

# Authinication with cookie

```javascript
const lib = require("instagram-apis");
const client = new lib();
(
    async () => {
        await client.init({
            cookie: "COOKIE"
        })
    }
)();
```

## - Profile API's :

-   #### All functions returning a values ( no-void functions )
-   User ID is the identifier of any account in Instagram.
    | Function | Parameters | Do What ? | Example |
    | ------------------------------- | ------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------- |
    | getUsernameInfo() | username **[required]** | Returns account information | await client.getUsernameInfo("afph") |
    | getInfoByUserId() | UserID **[required]** | Returns account information | await client.getUsernameInfo("1443437479") |
    | followByUsername() | username **[required]** | To follow an account | await client.followByUsername("afph") |
    | followByUserId() | UserID **[required]** | To follow an account | await client.followByUserId("1443437479") |
    | blockByUsername() | username **[required]** | To block an account | await client.blockByUsername("afph") |
    | blockByUserId() | UserID **[required]** | To block an account | await client.blockByUserId("1443437479") |
    | unfollowByUsername() | username **[required]** | To unfollow an account | await client.unfollowByUsername("afph") |
    | unfollowByUserId() | UserID **[required]** | To unfollow an account | await client.unfollowByUserId("1443437479") |
    | getAccountStoriesDataByUserId() | UserID **[required]** | To get all stories data of account | await client.getAccountStoriesDataByUserId("1443437479") |
    | changeUsername() | username **[required]** | To change account username to new username passed in parameters | await client.changeUsername("newusername") |
    | changeBiography() | biography **[required]** | To change account biography to new biography passed in parameters | await client.changeBiography("NEW_BIO") |
    | changeFirstName() | firstName **[required]** | To change account FirstName to new biography passed in parameters | await client.changeFirstName("NEW_FIRST_NAME") |

## Chatting API's :

##### A piece of information :

-   #### All functions returning a values ( no-void functions )
-   Thread ID is a code of the chat between you logged account and other account.
-   Cursor is an ID used to get old messages or chats.
-   Video URL should return video/mp4 as data mimeType
-   Photo URL should return image/jpeg as data mimeType
    <br />
    | Function | Parameters | Do What ? | Example |
    | ---------------------- | --------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
    | sendMessageToUserIds() | { userIds **[required]** , message **[required]** } | Send Messages To account with User IDs | await client.sendMessageToUserIds({userIds: ["1443437479"], message: "MESSAGE_TEXT"}) |
    | getThreadIdByUserId() | userid **[required]** | Returns the thread id of chat that between logged account and other account | await client.getThreadIdByUserId("1443437479") |
    | getChatMessages() | { thread_id **[required]**, cursor } | Returns last 20 messages in specific chat with cursor |- await client.getChatMessages({thread_id: "THREAD_ID"})<br/>- await client.getChatMessages({thread_id: "THREAD_ID", cursor: "CURSOR"})
    | getChats() | cursor | Returns last 20 chats with or without cursor, also last 20 messages of each chat | - await client.getChats()<br/>- await client.getChats("THE_CURSOR") |
    getLastMessagingRequests() | | Returns last pending chats in request messages | await client.getLastMessagingRequests() |
    | acceptMessageRequest() | thread_id **[required]** | Accept message request with specific thread ID | await client.acceptMessageRequest("THREAD_ID")|
    | restirectChatByUserId() | UserID **[required]** | restirect specific account with user ID | await client.restirectChatByUserId("1443437479") |
    | unRestirectChatByUserId() | UserID **[required]** | unrestirect specific account with user ID | await client.unRestirectChatByUserId("1443437479") |
    | deleteChat() | thread_id **[required]** | Delete a specific chat with thread ID | await client.deleteChat("THREAD_ID") |
    | unSendMessage() | { thread_id **[required]**, item_id **[required]** } | Unsend (Delete) a specific message in specific chat using thread ID and item ID | await client.unSendMessage({thread_id: "THREAD_ID", item_id: "ITEM_ID"}) |
    | sendPhotoToChat() | { url **[required]**, thread_id **[required]** } | Send photo from URL to chat using thread ID and image[jpg] URL. | await client.sendPhotoToChat({url: "https://i.imgur.com/H43LKYL.png", thread_id: "THREAD_ID"}) |
    | sendVideoToChat() | { url **[required]**, thread_id **[required]** } | Send video from URL to chat using thread ID and video[mp4] URL. | await client.sendVideoToChat({url: "https://i.imgur.com/3nn5VcM.mp4", thread_id: "THREAD_ID"}) |

## Media API's :

##### A piece of information :

-   #### All functions returning a values ( no-void functions )
-   Media ID is an identifier for images, photos, posts, reels, stories and other. It used in API's .

    | Function                  | Parameters              | Do What ?                                   | Example                                                                        |
    | ------------------------- | ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------------ |
    | getShortcodeFromURL()     | URL **[required]**      | Returns the shortcode (e.g. `CfXDtqmFUXd`) of post or reels | client.getShortcodeFromURL("https://www.instagram.com/p/CfXDtqmFUXd/") |
    | shortcodeToMediaId()      | shortcode **[required]**| Converts the shortcode to media ID          | client.shortcodeToMediaId("CfXDtqmFUXd")                                     |
    | getMediaIdFromURL()       | URL **[required]**      | Returns the media ID of post or reels       | client.getMediaIdFromURL("https://www.instagram.com/p/CfJn1AHAFdA/")         |
    | getMediaInfoFromMediaId() | media_id **[required]** | Returns the media information               | await client.getMediaInfoFromMediaId("MEDIA_ID")                             |
    | getMediaInfoFromURL()     | URL **[required]**      | Returns the media information               | await client.getMediaInfoFromURL("https://www.instagram.com/p/CfJn1AHAFdA/") |
    | likePostByMediaId()       | media_id **[required]** | Like a post with media ID                   | await client.likePostByMediaId("THE_MEDIA_ID")                               |
    | unLikePostByMediaId()     | media_id **[required]** | Unlike a post with media ID                 | await client.unLikePostByMediaId("THE_MEDIA_ID")                             |
    | deletePost()              | media_id **[required]** | Delete a post with speific media ID         | await client.deletePost("THE_MEDIA_ID")                                      |
    | getPostComments()         | media_id **[required]** | Returns post comments with speific media ID | await client.getPostComments("THE_MEDIA_ID")                                 |

## News Inbox API's :
-   #### All functions returning a values ( no-void functions )

| Function               | Parameters            | Do What ?                    | Example                                        |
| ---------------------- | --------------------- | ---------------------------- | ---------------------------------------------- |
| getLastFollowRequests  |                       | Returns last follow requests | await client.getLastFollowRequests()         |
| acceeptFollowRequest() | UserID **[required]** | Accepts follow request       | await client.acceeptFollowRequest("USER_ID") |
