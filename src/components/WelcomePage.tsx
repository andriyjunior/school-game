import {useState} from 'react';

interface WelcomePageProps {
    onSubmit: (name: string, classNumber: number) => void;
}

export default function WelcomePage({onSubmit}: WelcomePageProps) {
    const [name, setName] = useState('');
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [errors, setErrors] = useState({name: false, class: false});

    const handleSubmit = () => {
        const newErrors = {
            name: !name.trim(),
            class: !selectedClass
        };

        setErrors(newErrors);

        if (newErrors.name || newErrors.class) {
            return;
        }

        onSubmit(name.trim(), selectedClass!);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (!name.trim()) {
                setErrors(prev => ({...prev, name: true}));
            } else if (selectedClass) {
                handleSubmit();
            }
        }
    };

    const classGroups = [
        {label: 'Початкова школа', classes: [2, 3, 4], color: '#667eea'},
        {label: 'Середня школа', classes: [5, 6, 7, 8, 9], color: '#f093fb'},
        {label: 'Старша школа', classes: [10, 11], color: '#f5576c'}
    ];

    return (
        <div style={{
            textAlign: 'center',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '30px',
                color: 'white'
            }}>
                <div style={{fontSize: '3em', marginBottom: '15px'}}>
                    <i className="fas fa-graduation-cap"></i>
                </div>
                <h1 style={{
                    fontSize: '2.2em',
                    marginBottom: '10px',
                    fontWeight: 'bold'
                }}>
                    Класна Робота
                </h1>
                <p style={{
                    fontSize: '1.1em',
                    opacity: 0.9,
                    margin: 0
                }}>
                    Освітня платформа для учнів 1-11 класів
                </p>
            </div>

            {/* Name Input */}
            <div style={{marginBottom: '25px', textAlign: 'left'}}>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                    fontSize: '1.1em',
                    fontWeight: '600',
                    color: '#333'
                }}>
                    <i className="fas fa-user" style={{color: '#667eea'}}></i>
                    Як тебе звати?
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrors(prev => ({...prev, name: false}));
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Введи своє ім'я та прізвище..."
                    autoFocus
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '1.1em',
                        border: errors.name ? '2px solid #dc3545' : '2px solid #e0e0e0',
                        borderRadius: '12px',
                        outline: 'none',
                        transition: 'border-color 0.3s',
                        boxSizing: 'border-box'
                    }}
                />
                {errors.name && (
                    <p style={{
                        color: '#dc3545',
                        fontSize: '0.9em',
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <i className="fas fa-exclamation-circle"></i>
                        Будь ласка, введи своє ім'я
                    </p>
                )}
            </div>

            {/* Class Selection */}
            <div style={{marginBottom: '25px', textAlign: 'left'}}>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '15px',
                    fontSize: '1.1em',
                    fontWeight: '600',
                    color: '#333'
                }}>
                    <i className="fas fa-school" style={{color: '#667eea'}}></i>
                    В якому ти класі?
                </label>

                {classGroups.map((group, groupIndex) => (
                    <div key={groupIndex} style={{marginBottom: '15px'}}>
                        <p style={{
                            fontSize: '0.85em',
                            color: '#666',
                            marginBottom: '8px',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {group.label}
                        </p>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
                            gap: '8px'
                        }}>
                            {group.classes.map(classNum => (
                                <button
                                    key={classNum}
                                    onClick={() => {
                                        setSelectedClass(classNum);
                                        setErrors(prev => ({...prev, class: false}));
                                    }}
                                    style={{
                                        padding: '15px 10px',
                                        fontSize: '1.2em',
                                        fontWeight: 'bold',
                                        border: `3px solid ${selectedClass === classNum ? group.color : '#e0e0e0'}`,
                                        background: selectedClass === classNum
                                            ? `linear-gradient(135deg, ${group.color}15, ${group.color}25)`
                                            : 'white',
                                        color: selectedClass === classNum ? group.color : '#666',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        transform: selectedClass === classNum ? 'scale(1.05)' : 'scale(1)',
                                        boxShadow: selectedClass === classNum
                                            ? `0 4px 12px ${group.color}40`
                                            : '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {classNum}
                                    {selectedClass === classNum && (
                                        <div style={{fontSize: '0.5em', marginTop: '2px'}}>
                                            <i className="fas fa-check-circle"></i>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {errors.class && (
                    <p style={{
                        color: '#dc3545',
                        fontSize: '0.9em',
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <i className="fas fa-exclamation-circle"></i>
                        Будь ласка, вибери свій клас
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!name.trim() || !selectedClass}
                style={{
                    width: '100%',
                    padding: '18px',
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                    background: (name.trim() && selectedClass)
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : '#e0e0e0',
                    color: (name.trim() && selectedClass) ? 'white' : '#999',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: (name.trim() && selectedClass) ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                }}
            >
                {(name.trim() && selectedClass) ? 'Почати' : 'Заповни всі поля'}
                {(name.trim() && selectedClass) && <i className="fas fa-arrow-right"></i>}
            </button>

            {/* Help Text */}
            <p style={{
                marginTop: '15px',
                fontSize: '0.85em',
                color: '#999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
            }}>
                <i className="fas fa-info-circle"></i>
                Натисни Enter для швидкого продовження
            </p>
        </div>
    );
}
