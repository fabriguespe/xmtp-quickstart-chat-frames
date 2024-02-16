const Frame = ({ info, handleClick, frameButtonUpdating, frameUrl }) => {
  const { buttons, image, title } = info;

  const styles = {
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
    },
    button: {
      flex: 1,
      // Assuming a margin of 4px between buttons for visual separation
      marginRight: "4px",
      backgroundColor: "white",
      border: "0px",
    },
    imageFrame: {
      width: "200px",
      bottom: "0",
      right: "0",
    },
    firstButton: {
      marginLeft: 0,
    },
    lastButton: {
      marginRight: 0,
    },
    redirectIcon: {
      marginLeft: "5px", // Space between the button label and the icon
    },
  };

  return (
    <>
      <a href={frameUrl} target="_blank" rel="noopener noreferrer">
        <img src={image} alt={title} style={styles.imageFrame} />
      </a>
      <div style={styles.buttonContainer}>
        {buttons?.map((button, index) => {
          if (!button) {
            return null;
          }
          const handlePress = () => handleClick(index + 1);
          const buttonStyle = {
            ...styles.button,
            ...(index === 0 ? styles.firstButton : {}),
            ...(index === buttons.length - 1 ? styles.lastButton : {}),
          };
          return (
            <button
              key={`${button}-${index}`}
              onClick={handlePress}
              disabled={frameButtonUpdating === index + 1}
              style={buttonStyle}>
              {button.label}{" "}
              {button.action === "post_redirect" && (
                <span style={styles.redirectIcon}>↪</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};
const BUTTON_PREFIX = "fc:frame:button:";
const IMAGE_PREFIX = "fc:frame:image";
const POST_URL_PREFIX = "fc:frame:post_url";
const TITLE_PREFIX = "og:title";

const getFrameInfo = (extractedTags) => {
  const buttons = [];
  let image = "";
  let postUrl = "";
  let title = "";
  for (const key in extractedTags) {
    if (key.startsWith(BUTTON_PREFIX)) {
      if (!key.includes(":action")) {
        const buttonIndex = parseInt(key.replace(BUTTON_PREFIX, ""), 10) - 1;
        // Initialize the button object if it doesn't exist
        buttons[buttonIndex] = buttons[buttonIndex] || {};
        // Set the label for the button
        buttons[buttonIndex].label = extractedTags[key];
      }
    } else if (key.startsWith(IMAGE_PREFIX)) {
      image = extractedTags[key];
    } else if (key.startsWith(POST_URL_PREFIX)) {
      postUrl = extractedTags[key];
    } else if (key.startsWith(TITLE_PREFIX)) {
      title = extractedTags[key];
    }

    // Separately handle action tags to fill the actions object and directly assign to buttons
    if (key.includes(":action")) {
      const actionIndex = parseInt(key.split(":")[3], 10) - 1; // Adjusted to match buttonIndex calculation
      // Initialize the button object if it doesn't exist
      buttons[actionIndex] = buttons[actionIndex] || {};
      // Set the action for the button
      buttons[actionIndex].action = extractedTags[key];
    }
  }

  // Ensure all buttons have at least an empty action if none was specified
  buttons.forEach((button) => (button.action = button.action || ""));

  // Now, buttons array will only contain button labels, and actions are stored separately
  return {
    buttons,
    image,
    postUrl,
    title,
  };
};
export { Frame, getFrameInfo };
