import React, { useState, useEffect, useRef } from 'react';

const TypingText = ({ text, speed = 20 }) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < text.length) {
                setDisplayText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, speed);

        return () => clearInterval(typingEffect);
    }, [text, speed]);

    return < > { displayText } < />;
};

const CommandLinePortfolio = () => {
    const [output, setOutput] = useState([]);
    const [currentPath, setCurrentPath] = useState('C:\\PORTFOLIO>');
    const [inputHistory, setInputHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isProcessing, setIsProcessing] = useState(false);
    const inputRef = useRef(null);

    const commands = {
        help: () => [
            'AVAILABLE COMMANDS:',
            '  HELP     - Show this help menu',
            '  ABOUT    - Display personal information',
            '  SKILLS   - List technical skills',
            '  PROJECTS - Show current projects',
            '  CONTACT  - View contact details',
            '  CLS      - Clear screen',
            '  EXIT     - Close terminal'
        ],
        about: () => [
            'PERSONAL PROFILE:',
            '  NAME: DEVELOPER X',
            '  ROLE: SOFTWARE ENGINEER',
            '  PASSION: TURNING COFFEE INTO CODE'
        ],
        skills: () => [
            'TECHNICAL SKILLS:',
            '  LANGUAGES:',
            '    - JAVASCRIPT  [████████████] 90%',
            '    - PYTHON      [████████] 80%',
            '    - RUST        [████] 45%',
            '  FRAMEWORKS:',
            '    - REACT       [████████████] 95%',
            '    - NODE.JS     [████████] 85%'
        ],
        projects: () => [
            'CURRENT PROJECTS:',
            '  1. COMMAND LINE PORTFOLIO',
            '     - TECHNOLOGY: REACT',
            '     - STATUS: IN DEVELOPMENT',
            '  2. AI MEME GENERATOR',
            '     - TECHNOLOGY: PYTHON, ML',
            '     - STATUS: PROTOTYPE'
        ],
        contact: () => [
            'CONTACT INFORMATION:',
            '  EMAIL: DEV@EXAMPLE.COM',
            '  GITHUB: @DEVELOPERX',
            '  LINKEDIN: /IN/DEVELOPERX'
        ],
        cls: () => {
            setOutput([]);
            return [];
        },
        exit: () => {
            window.close();
            return ['TERMINAL CLOSED.'];
        }
    };

    const processCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toUpperCase();

        // Check for command
        const commandFunc = commands[trimmedCmd.toLowerCase()];

        // If command exists, return its output
        if (commandFunc) {
            return commandFunc();
        }

        // Default for unknown commands
        return [UNKNOWN COMMAND: $ { trimmedCmd }, 'TYPE "HELP" FOR AVAILABLE COMMANDS'];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cmd = inputRef.current.value;

        // Prevent multiple command processing
        if (isProcessing) return;

        // Update input history
        setInputHistory(prev => [cmd, ...prev]);
        setHistoryIndex(-1);

        // Process command and update output
        setIsProcessing(true);
        const cmdOutput = processCommand(cmd);

        // Add command and its output with typing effect
        setOutput(prev => [
            ...prev,
            $ { currentPath }
            $ { cmd },
            ...cmdOutput.map(line => ({ text: line, typed: true }))
        ]);

        // Clear input and reset processing
        inputRef.current.value = '';
        setIsProcessing(false);
    };

    const handleKeyDown = (e) => {
        // Arrow up/down for command history
        if (e.key === 'ArrowUp') {
            const newIndex = Math.min(historyIndex + 1, inputHistory.length - 1);
            if (inputHistory.length > 0) {
                inputRef.current.value = inputHistory[newIndex];
                setHistoryIndex(newIndex);
            }
        } else if (e.key === 'ArrowDown') {
            const newIndex = Math.max(historyIndex - 1, -1);
            if (newIndex === -1) {
                inputRef.current.value = '';
            } else {
                inputRef.current.value = inputHistory[newIndex];
            }
            setHistoryIndex(newIndex);
        }
    };

    useEffect(() => {
        // Initial welcome message with typing effect
        setOutput([
            { text: 'WELCOME TO DEVELOPER X TERMINAL', typed: true },
            { text: 'TYPE "HELP" FOR AVAILABLE COMMANDS', typed: true }
        ]);
    }, []);

    return ( <
        div className = "bg-black text-green-400 font-mono min-h-screen p-4" >
        <
        div className = "terminal-window h-[600px] overflow-y-auto" > {
            output.map((line, index) => ( <
                div key = { index } > {
                    line.typed ? ( <
                        TypingText text = { line.text }
                        />
                    ) : (
                        line
                    )
                } <
                /div>
            ))
        } <
        form onSubmit = { handleSubmit }
        className = "flex" >
        <
        span > { currentPath } < /span> <
        input ref = { inputRef }
        type = "text"
        className = "bg-black text-green-400 outline-none flex-grow ml-2"
        onKeyDown = { handleKeyDown }
        disabled = { isProcessing }
        autoFocus /
        >
        <
        /form> < /
        div > <
        /div>
    );
};

export default CommandLinePortfolio;