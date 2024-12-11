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

    return <>{displayText}</>;
};

const BootAnimation = ({ onBootComplete }) => {
    const [bootLines, setBootLines] = useState([]);
    const bootSequence = [
        'BOOTING SYSTEM...',
        'INITIALIZING KERNEL...',
        'LOADING SYSTEM RESOURCES...',
        'CHECKING HARDWARE COMPATIBILITY...',
        'AUTHENTICATING USER...',
        'SYSTEM READY.'
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            const newLines = [];
            let currentIndex = 0;

            const addLine = () => {
                if (currentIndex < bootSequence.length) {
                    newLines.push(bootSequence[currentIndex]);
                    setBootLines([...newLines]);
                    currentIndex++;

                    if (currentIndex < bootSequence.length) {
                        setTimeout(addLine, 500);
                    } else {
                        setTimeout(onBootComplete, 1000);
                    }
                }
            };

            addLine();
        }, 500);

        return () => clearTimeout(timer);
    }, [onBootComplete]);

    return (
        <div className="bg-black text-green-400 font-mono h-screen overflow-hidden p-4">
            {bootLines.map((line, index) => (
                <div key={index} className="animate-fade-in">
                    <TypingText text={`>> ${line}`} speed={30} />
                </div>
            ))}
        </div>
    );
};

const ExitAnimation = () => {
    const [exitLines, setExitLines] = useState([]);
    const exitSequence = [
        'SAVING SYSTEM STATE...',
        'CLOSING ACTIVE PROCESSES...',
        'CLEARING TEMPORARY RESOURCES...',
        'SYSTEM SHUTDOWN COMPLETE.'
    ];

    useEffect(() => {
        const newLines = [];
        let currentIndex = 0;

        const addLine = () => {
            if (currentIndex < exitSequence.length) {
                newLines.push(exitSequence[currentIndex]);
                setExitLines([...newLines]);
                currentIndex++;

                if (currentIndex < exitSequence.length) {
                    setTimeout(addLine, 500);
                }
            }
        };

        addLine();
    }, []);

    return (
        <div className="bg-black text-red-400 font-mono h-screen overflow-hidden p-4">
            {exitLines.map((line, index) => (
                <div key={index} className="animate-fade-in">
                    <TypingText text={`>> ${line}`} speed={30} />
                </div>
            ))}
        </div>
    );
};

const CommandLinePortfolio = () => {
    const [output, setOutput] = useState([]);
    const [currentPath, setCurrentPath] = useState('C:\\PORTFOLIO>');
    const [inputHistory, setInputHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isBooted, setIsBooted] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const inputRef = useRef(null);
    const terminalRef = useRef(null);

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
            '  PERSONAL PROFILE:',
            '  NAME: AMAL JERRY',
            '  ROLE: SOFTWARE ENGINEER',
            '  PASSION: TURNING COFFEE INTO CODE'
        ],
        skills: () => [
            '  TECHNICAL SKILLS:',
            '  LANGUAGES:',
            '    - PYTHON          [████████████] 90%',
            '    - JAVASCRIPT       [████████] 80%',
            '    - C/C++            [████] 45%',
            '  FRAMEWORKS:',
            '    - REACT            [████████████] 95%',
            '    - NODE.JS          [████████] 85%',
            '    - THREE.JS         [████] 45%'
        ],
        projects: () => [
            'CURRENT PROJECTS:',
            '  1. PERSONALIZED RECIPE RECOMMENDATION',
            '     - TECHNOLOGY: PYTHON, ML',
            '     - STATUS: IN DEVELOPMENT',
            '  2. AUDIO STEM SEPARATION AND SPATIALIZATION',
            '     - TECHNOLOGY: PYTHON, ML',
            '     - STATUS: IN DEVELOPMENT'
        ],
        contact: () => [
            '  CONTACT INFORMATION:',
            '  EMAIL: AMALJERRY02@GMAIL.COM',
            '  GITHUB: @STRANGELEO02',
            '  LINKEDIN: @AMALJERRY02'
        ],
        cls: () => {
            setOutput([]);
            return [];
        },
        exit: () => {
            setIsExiting(true);
            return ['PREPARING TO CLOSE TERMINAL...'];
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
        return [`UNKNOWN COMMAND: ${trimmedCmd}`, 'TYPE "HELP" FOR AVAILABLE COMMANDS'];
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
            `${currentPath} ${cmd}`,
            ...cmdOutput.map(line => ({ text: line, typed: true }))
        ]);
        
        // Clear input and reset processing
        inputRef.current.value = '';
        setIsProcessing(false);

        // Scroll to bottom
        setTimeout(() => {
            if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
            }
        }, 50);
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

    // Handle boot and exit states
    if (isExiting) {
        return <ExitAnimation />;
    }

    if (!isBooted) {
        return <BootAnimation onBootComplete={() => {
            setIsBooted(true);
            setOutput([
                { text: '  TERMINAL', typed: true },
                { text: '  TYPE "HELP" FOR AVAILABLE COMMANDS', typed: true }
            ]);
        }} />;
    }

    return (
        <div className="bg-black text-green-400 font-mono h-screen overflow-hidden">
            <div 
                ref={terminalRef}
                className="h-full overflow-auto p-4 pb-12"
            >
                {output.map((line, index) => (
                    <div key={index}>
                        {line.typed ? (
                            <TypingText text={line.text} />
                        ) : (
                            line
                        )}
                    </div>
                ))}
                <form onSubmit={handleSubmit} className="flex mt-4">
                    <span>{currentPath}</span>
                    <input 
                        ref={inputRef}
                        type="text"
                        className="bg-black text-green-400 outline-none flex-grow ml-2"
                        onKeyDown={handleKeyDown}
                        disabled={isProcessing}
                        autoFocus 
                    />
                </form>
            </div>
        </div>
    );
};

export default CommandLinePortfolio;