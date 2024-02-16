import React, { useState, useEffect } from "react";
import { useClient } from "@xmtp/react-sdk";
import { getFrameInfo, Frame } from "./Frame"; // Ensure this path is correct
import { FramesClient, signFrameAction } from "@xmtp/frames-client";

const MessageItem = ({
  message,
  peerAddress,
  senderAddress,
  isPWA = false,
}) => {
  const { client } = useClient();

  const [frameInfo, setFrameInfo] = useState(null);
  const [frameButtonUpdating, setFrameButtonUpdating] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const handleFrameButtonClick = async (buttonNumber) => {
    if (!frameInfo) {
      return;
    }
    const actionType = frameInfo.buttons[buttonNumber - 1].action;
    console.log("Action type: ", actionType);
    console.log(frameInfo);

    const conversationTopic = message.conversationTopic;

    setFrameButtonUpdating(buttonNumber);

    const framesClient = new FramesClient(client);
    const frameUrl = frameInfo.url;
    const payload = await framesClient.signFrameAction({
      frameUrl,
      buttonIndex: buttonNumber,
      conversationTopic,
      participantAccountAddresses: [peerAddress, client.address],
    });
    console.log("Payload: ", payload);

    try {
      if (actionType === "post") {
        const updatedFrameMetadata = await framesClient.proxy.post(
          frameInfo.postUrl,
          payload
        );
        const updatedFrameInfo = getFrameInfo(
          updatedFrameMetadata.extractedTags
        );
        setFrameInfo(updatedFrameInfo);
      } else if (actionType === "post_redirect") {
        // If the button action type was `post_redirect`
        console.log("Redirecting to: ", frameUrl);
        const { redirectedTo } = await framesClient.proxy.postRedirect(
          frameInfo.postUrl,
          payload
        );
        console.log("Redirected to: ", redirectedTo);
        window.open(redirectedTo, "_blank").focus();
      }
    } catch (error) {
      console.log("Error signing frame action: ", error);
      setFrameButtonUpdating(0);
      return;
    }

    setFrameButtonUpdating(buttonNumber);
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      if (typeof message.content === "string") {
        const words = message.content?.split(/(\r?\n|\s+)/);
        const urlRegex =
          /^(http[s]?:\/\/)?([a-z0-9.-]+\.[a-z0-9]{1,}\/.*|[a-z0-9.-]+\.[a-z0-9]{1,})$/i;

        // Split potential concatenated URLs based on "http" appearing in the middle of the string
        const splitUrls = (word) => {
          const splitPattern = /(?=http)/g;
          return word.split(splitPattern);
        };

        // Then, in your Promise.all block, adjust the logic to first split words that could be concatenated URLs
        void Promise.all(
          words.flatMap(splitUrls).map(async (word) => {
            // Use flatMap with the splitUrls function
            const isUrl = !!word.match(urlRegex)?.[0];
            if (isUrl) {
              try {
                const framesClient = new FramesClient(client);
                const metadata = await framesClient.proxy.readMetadata(word);
                if (metadata) {
                  const info = getFrameInfo(metadata.extractedTags);
                  console.log("Frame info: ", info);
                  info.url = metadata.url;
                  setFrameInfo(info);
                }
              } catch {
                console.log("Error parsing message content");
              }
            }
          })
        );
      }
    } catch {
      console.log("Error parsing message content");
    }
    setIsLoading(false);
  }, [message?.content]);

  const styles = {
    messageContent: {
      backgroundColor: "lightblue",
      padding: isPWA == true ? "10px 20px" : "5px 10px",
      alignSelf: "flex-start",
      textAlign: "left",
      display: "inline-block",
      margin: isPWA == true ? "10px" : "5px",
      borderRadius: isPWA == true ? "10px" : "5px",
      maxWidth: "80%",
      wordBreak: "break-word",
      cursor: "pointer",
      listStyle: "none",
    },
    renderedMessage: {
      fontSize: isPWA == true ? "16px" : "12px",
      wordBreak: "break-word",
      padding: "0px",
    },
    senderMessage: {
      alignSelf: "flex-start",
      textAlign: "left",
      listStyle: "none",
      width: "100%",
    },
    receiverMessage: {
      alignSelf: "flex-end",
      listStyle: "none",
      textAlign: "right",
      width: "100%",
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    timeStamp: {
      fontSize: isPWA == true ? "12px" : "8px",
      color: "grey",
    },
  };

  const renderMessage = (message) => {
    try {
      if (message?.content.length > 0) {
        return <div style={styles.renderedMessage}>{message?.content}</div>;
      }
    } catch {
      return message?.contentFallback ? (
        message?.contentFallback
      ) : (
        <div style={styles.renderedMessage}>{message?.content}</div>
      );
    }
  };

  const isSender = senderAddress === client?.address;

  return (
    <li
      style={isSender ? styles.senderMessage : styles.receiverMessage}
      key={message.id}
    >
      <div style={styles.messageContent}>
        {!frameInfo && renderMessage(message)}
        {isLoading && <div>Loading...</div>}
        <div style={styles.footer}>
          <span style={styles.timeStamp}>
            {`${new Date(message.sentAt).getHours()}:${String(
              new Date(message.sentAt).getMinutes()
            ).padStart(2, "0")}`}
          </span>
        </div>
        {!isLoading && frameInfo && (
          <Frame
            info={frameInfo}
            handleClick={handleFrameButtonClick}
            frameButtonUpdating={frameButtonUpdating}
            frameUrl={frameInfo.url} // Passing the new prop
          />
        )}
      </div>
    </li>
  );
};
export default MessageItem;
