/*
The FrameButtons component receives the following props:
If there are 2 buttons they get split on the first line
If there are 3 buttons the first two split a line and the third button takes the second line
4 buttons have two split lines
The arrow icon only appears on buttons that will open a new browser window.
*/

const styles = {
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
  },
  button: {
    flex: 1,
    marginRight: "4px",
    backgroundColor: "white",
    border: "0px",
  },
  imageFrame: {
    width: "200px",
    bottom: "0",
    right: "0",
  },
  redirectIcon: {
    marginLeft: "5px", // Space between the button label and the icon
  },
};

export const FrameButtons = ({
  image,
  title,
  buttons,
  handleClick,
  frameButtonUpdating,
  interactionsEnabled,
  textInput,
  onTextInputChange,
}) => {
  console.log(buttons, "buttons");
  const renderButton = (button, index) => {
    if (!button) {
      return null;
    }

    const handlePress = () => handleClick(button.buttonIndex, button.action);
    const buttonStyle = {
      ...styles.button,
      marginRight: index % 2 === 0 ? "4px" : "0px", // Adjust marginRight for every second button
    };
    return (
      <button
        key={`${button}-${index}`}
        onClick={handlePress}
        disabled={frameButtonUpdating === index + 1}
        style={buttonStyle}>
        {button.label}
        {button.action === "post_redirect" && (
          <span style={styles.redirectIcon}>↪</span>
        )}
      </button>
    );
  };

  return (
    <>
      <a href={""} target="_blank" rel="noopener noreferrer">
        <img src={image} alt={title} style={styles.imageFrame} />
      </a>
      <div style={styles.buttonContainer}>
        {buttons.length <= 2 && (
          <div style={styles.buttonRow}>
            {buttons.map((button, index) => renderButton(button, index))}
          </div>
        )}
        {buttons.length === 3 && (
          <>
            <div style={styles.buttonRow}>
              {buttons
                .slice(0, 2)
                .map((button, index) => renderButton(button, index))}
            </div>
            <div style={styles.buttonRow}>{renderButton(buttons[2], 2)}</div>
          </>
        )}
        {buttons.length >= 4 && (
          <>
            <div style={styles.buttonRow}>
              {buttons
                .slice(0, 2)
                .map((button, index) => renderButton(button, index))}
            </div>
            <div style={styles.buttonRow}>
              {buttons
                .slice(2, 4)
                .map((button, index) => renderButton(button, index + 2))}
            </div>
          </>
        )}
      </div>
      {interactionsEnabled && textInput !== undefined && (
        <input
          type="text"
          value={textInput}
          onChange={onTextInputChange} // Call the provided function when text input changes
          style={styles.textInput} // Apply your text input styling here
          disabled={!interactionsEnabled} // Disable text input if interactions are disabled
        />
      )}
    </>
  );
};
