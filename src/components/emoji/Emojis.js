import PropTypes from 'prop-types';
import React from 'react';
import { EmojiContainer, EmojiPickerContainer } from "./emoji.style"

const Emojis = ({ pickEmoji }) => {
    return (
        <EmojiContainer>
            {
                <EmojiPickerContainer onEmojiClick={pickEmoji} searchDisabled={false} searchPlaceholder=" Search"/>
            }
        </EmojiContainer>
    )
};

Emojis.propTypes = {
    pickEmoji: PropTypes.func
};

export default Emojis;