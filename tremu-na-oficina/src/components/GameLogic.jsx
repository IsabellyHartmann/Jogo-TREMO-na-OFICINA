import React, { useState } from 'react';
import GestureModel from './GestureModel';

const DICIONARIO = ["OLEO", "RODA", "AUTO", "FAIS", "PECA", "CABO"];

export default function GameLogic() {
    const [palavra, setPalavra] = useState(() => DICIONARIO[Math.floor(Math.random() * DICIONARIO.length)]);
    const [letraIndex, setLetraIndex] = useState(0);
    const [sucesso, setSucesso] = useState(false);

    const letraAtual = palavra[letraIndex];

    const jogoAvancar = () => {
        if (letraIndex + 1 < palavra.length) {
            setLetraIndex(letraIndex + 1);
        } else {
            setSucesso(true);
        }
    };

    const proximaPalavra = () => {
        setPalavra(DICIONARIO[Math.floor(Math.random() * DICIONARIO.length)]);
        setLetraIndex(0);
        setSucesso(false);
    };

    return (
        <div style={{ background: '#2b2b2b', color: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
                {palavra.split('').map((char, idx) => (
                    <span key={idx} style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        border: '3px solid #ffcc00', // Amarelo industrial de oficina
                        backgroundColor: idx < letraIndex || sucesso ? '#28a745' : '#1e1e1e',
                        color: '#fff',
                        transition: 'all 0.3s ease'
                    }}>
                        {idx < letraIndex || sucesso ? char : '?'}
                    </span>
                ))}
            </div>

            {!sucesso ? (
                <GestureModel letraAlvo={letraAtual} onLetraIdentificada={jogoAvancar} />
            ) : (
                <div style={{ padding: '20px', background: '#28a745', borderRadius: '10px', marginTop: '15px' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>🎉 Reparação Concluída! Peça Montada!</h3>
                    <button
                        onClick={proximaPalavra}
                        style={{ padding: '10px 25px', fontSize: '16px', fontWeight: 'bold', color: '#333', backgroundColor: '#ffcc00', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Próxima Palavra 🔧
                    </button>
                </div>
            )}
        </div>
    );
}