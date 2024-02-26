# XMTP Frames Quickstart

## Installation

```bash
bun install
bun start
```

## Introduction

The XMTP Frames guide you're looking at is designed to help developers integrate XMTP frames into their applications. It covers both the use of protocol libraries, which enable the creation and handling of XMTP frames, and the practical aspects of rendering these frames within an application. Here's a breakdown to clarify the separation:

### Protocol Libraries

These are the foundational tools that allow developers to create, sign, and manage XMTP frames. The protocol libraries are essential for interacting with the XMTP network at a lower level, handling the creation of frames, signing payloads, and managing frame actions. Key aspects include:

- [**Install Required Packages**](https://xmtp.org/docs/build/frames#install-required-packages): To begin, add the necessary XMTP packages to your project.
- [**Declare Protocol Compatibility**](https://xmtp.org/docs/build/frames#declare-protocol-compatibility): Ensure your application can interact with XMTP frames by declaring protocol compatibility.
- [**Validate Incoming Messages**](https://xmtp.org/docs/build/frames#Validate-Incoming-Messages): Checks if a URL in message content is suitable for frame processing.
- [**Enable Secure Communication**](https://xmtp.org/docs/build/frames#enable-secure-communication): Implements security measures to authenticate and secure frame actions, ensuring the integrity and origin of frame interactions.

### Rendering Frames in Your Application

This part of the guide focuses on how to render XMTP frames within your application, making the frames interactive and visually integrated. It includes:

- [**Validating Frame URL**](https://xmtp.org/docs/build/frames#validating-frame-url): Ensuring the URL embedded within the message content is appropriate for frame processing and meets XMTP standards.
- [**Getting Frame Metadata**](https://xmtp.org/docs/build/frames#getting-frame-metadata): Extracting and processing metadata from frames, including images, titles, buttons, and URLs, to facilitate rendering and interaction.
- [**Rendering Frames**](https://xmtp.org/docs/build/frames#rendering-frames): Dynamically generating a `Frame` component using the extracted metadata to visually present the frame content within your application.
- [**Handling Clicks in the Frames**](https://xmtp.org/docs/build/frames#handling-clicks-in-the-frames): Interpreting user interactions within a frame to determine and execute the corresponding action, such as navigating to a link or updating frame content.
- [**Sign XMTP Payload**](https://xmtp.org/docs/build/frames#sign-xmtp-payload): Authenticating and securing frame actions by signing XMTP payloads, ensuring the integrity and origin of frame interactions.

### Use cases

For inspiration and a deeper dive into how XMTP Frames can work across various domains, refer to the **[XMTP Frames Use Cases](/docs/use-cases/frames)** section below.
