# Install the package
```
npm install instagram-apis
```

# Authinication with username and password

```javascript
import client from "./index.js";
let myClient = new client();
async () => {
    await myClient.init({
        username: "USERNAME",
        password: "PASSWORD",
    });
    try {
    } catch (error) {
        console.error(JSON.stringify(error.message));
    }
};
```

# Authinication with coookie

```javascript
import client from "./index.js";
let myClient = new client();
async () => {
    await myClient.init({
        cookie: "COOKIE",
    });
    try {
    } catch (error) {
        console.error(JSON.stringify(error.message));
    }
};
```

## - Profile API's :

-   #### All functions returning a values ( no-void functions )
-   User ID is the identifier of any account in Instagram.
    | Function | Parameters | Do What ? | Example |
    | ------------------------------- | ------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------- |
    | getUsernameInfo() | username **[required]** | Returns account information | await myClient.getUsernameInfo("afph") |
    | getInfoByUserId() | UserID **[required]** | Returns account information | await myClient.getUsernameInfo("1443437479") |
    | followByUsername() | username **[required]** | To follow an account | await myClient.followByUsername("afph") |
    | followByUserId() | UserID **[required]** | To follow an account | await myClient.followByUserId("1443437479") |
    | blockByUsername() | username **[required]** | To block an account | await myClient.blockByUsername("afph") |
    | blockByUserId() | UserID **[required]** | To block an account | await myClient.blockByUserId("1443437479") |
    | unfollowByUsername() | username **[required]** | To unfollow an account | await myClient.unfollowByUsername("afph") |
    | unfollowByUserId() | UserID **[required]** | To unfollow an account | await myClient.unfollowByUserId("1443437479") |
    | getAccountStoriesDataByUserId() | UserID **[required]** | To get all stories data of account | await myClient.getAccountStoriesDataByUserId("1443437479") |
    | changeUsername() | username **[required]** | To change account username to new username passed in parameters | await myClient.changeUsername("newusername") |
    | changeBiography() | biography **[required]** | To change account biography to new biography passed in parameters | await myClient.changeBiography("NEW_BIO") |
    | changeFirstName() | firstName **[required]** | To change account FirstName to new biography passed in parameters | await myClient.changeFirstName("NEW_FIRST_NAME") |

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
    | sendMessageToUserIds() | { userIds **[required]** , message **[required]** } | Send Messages To account with User IDs | await myClient.sendMessageToUserIds({userIds: ["1443437479"], message: "MESSAGE_TEXT"}) |
    | getThreadIdByUserId() | userid **[required]** | Returns the thread id of chat that between logged account and other account | await myClient.getThreadIdByUserId("1443437479") |
    | getChatMessages() | { thread_id **[required]**, cursor } | Returns last 20 messages in specific chat with cursor |- await myClient.getChatMessages({thread_id: "THREAD_ID"})<br/>- await await myClient.getChatMessages({thread_id: "THREAD_ID", cursor: "CURSOR"})
    | getChats() | cursor | Returns last 20 chats with or without cursor, also last 20 messages of each chat | - await myClient.getChats()<br/>- await myClient.getChats("THE_CURSOR") |
    getLastMessagingRequests() | | Returns last pending chats in request messages | await myClient.getLastMessagingRequests() |
    | acceptMessageRequest() | thread_id **[required]** | Accept message request with specific thread ID | await myClient.acceptMessageRequest("THREAD_ID")|
    | restirectChatByUserId() | UserID **[required]** | restirect specific account with user ID | await myClient.restirectChatByUserId("1443437479") |
    | unRestirectChatByUserId() | UserID **[required]** | unrestirect specific account with user ID | await myClient.unRestirectChatByUserId("1443437479") |
    | deleteChat() | thread_id **[required]** | Delete a specific chat with thread ID | await myClient.deleteChat("THREAD_ID") |
    | unSendMessage() | { thread_id **[required]**, item_id **[required]** } | Unsend (Delete) a specific message in specific chat using thread ID and item ID | await myClient.unSendMessage({thread_id: "THREAD_ID", item_id: "ITEM_ID"}) |
    | sendPhotoToChat() | { url **[required]**, thread_id **[required]** } | Send photo from URL to chat using thread ID and image[jpg] URL. | await myClient.sendPhotoToChat({url: "https://i.imgur.com/H43LKYL.png", thread_id: "THREAD_ID"}) |
    | sendVideoToChat() | { url **[required]**, thread_id **[required]** } | Send video from URL to chat using thread ID and video[mp4] URL. | await myClient.sendVideoToChat({url: "https://i.imgur.com/3nn5VcM.mp4", thread_id: "THREAD_ID"}) |

## Media API's :

##### A piece of information :

-   #### All functions returning a values ( no-void functions )
-   Media ID is an identifier for images, photos, posts, reels, stories and other. It used in API's .

    | Function                  | Parameters              | Do What ?                                   | Example                                                                        |
    | ------------------------- | ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------------ |
    | getMediaIdFromURL()       | URL **[required]**      | Returns the media ID of post or reels       | await myClient.getMediaIdFromURL("https://www.instagram.com/p/CfJn1AHAFdA/")   |
    | getMediaInfoFromMediaId() | media_id **[required]** | Returns the media information               | await myClient.getMediaInfoFromMediaId("MEDIA_ID")                             |
    | getMediaInfoFromURL()     | URL **[required]**      | Returns the media information               | await myClient.getMediaInfoFromURL("https://www.instagram.com/p/CfJn1AHAFdA/") |
    | likePostByMediaId()       | media_id **[required]** | Like a post with media ID                   | await myClient.likePostByMediaId("THE_MEDIA_ID")                               |
    | unLikePostByMediaId()     | media_id **[required]** | Unlike a post with media ID                 | await myClient.unLikePostByMediaId("THE_MEDIA_ID")                             |
    | deletePost()              | media_id **[required]** | Delete a post with speific media ID         | await myClient.deletePost("THE_MEDIA_ID")                                      |
    | getPostComments()         | media_id **[required]** | Returns post comments with speific media ID | await myClient.getPostComments("THE_MEDIA_ID")                                 |

## News Inbox API's :
-   #### All functions returning a values ( no-void functions )

| Function               | Parameters            | Do What ?                    | Example                                        |
| ---------------------- | --------------------- | ---------------------------- | ---------------------------------------------- |
| getLastFollowRequests  |                       | Returns last follow requests | await myClient.getLastFollowRequests()         |
| acceeptFollowRequest() | UserID **[required]** | Accepts follow request       | await myClient.acceeptFollowRequest("USER_ID") |
