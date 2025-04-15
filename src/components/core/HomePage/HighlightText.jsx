import React from 'react'

function HighlightText({ text }) {
    return (
        <span className='bg-gradient-to-b from-[#1FA2FF] via-[#12D8Fa] to-[#A6FFCB] text-transparent bg-clip-text font-bold ml-2'>{text}</span>
    )
}

export default HighlightText
