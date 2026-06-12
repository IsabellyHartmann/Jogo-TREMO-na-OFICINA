/*import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import CameraView from './CameraView';

export default function GestureModel({ letraAlvo, onLetraIdentificada }) {
    const [landmarker, setLandmarker] = useState(null);
    const [carregandoIA, setCarregandoIA] = useState(true);
    const [bloqueioAvanco, setBloqueioAvanco] = useState(false);
    const landmarkerRef = useRef(null);
    const bloqueioRef = useRef(false);
    const timeoutRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        async function carregarModelo() {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
                );

                const instancia = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        //modelAssetPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/hand_landmarker.task',
                        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                        delegate: 'CPU'
                    },
                    runningMode: 'VIDEO',
                    numHands: 1
                });

                setLandmarker(instancia);
                landmarkerRef.current = instancia;
                setCarregandoIA(false);
            } catch (erro) {
                console.error('Erro ao instanciar o MediaPipe:', erro);
            }
        }

        carregarModelo();

        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }
        };
    }, []);

    const processarFrameCamera = (videoElement) => {
        if (!landmarker || !videoElement || videoElement.readyState !== 4 || bloqueioRef.current) return;

        const agora = performance.now();
        const resultado = landmarker.detectForVideo(videoElement, agora);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (resultado.handLandmarks && resultado.handLandmarks.length > 0) {
            const pontosMao = resultado.handLandmarks[0];
            desenharEsqueletoNoCanvas(ctx, pontosMao);

            if (validarGestoLGP(pontosMao, letraAlvo)) {
                bloqueioRef.current = true;
                setBloqueioAvanco(true);
                onLetraIdentificada();

                timeoutRef.current = window.setTimeout(() => {
                    bloqueioRef.current = false;
                    setBloqueioAvanco(false);
                }, 1500);
            }
        }
    };

    const validarGestoLGP = (pontos, letra) => {
        if (!pontos || pontos.length < 21) return false;

        const indicadorAberto = pontos[8].y < pontos[6].y;
        const medioAberto = pontos[12].y < pontos[10].y;
        const anelarAberto = pontos[16].y < pontos[14].y;
        const mindinhoAberto = pontos[20].y < pontos[18].y;
        const polegarAfastado = Math.abs(pontos[4].x - pontos[3].x) > 0.05;

        switch (letra) {
            case 'A':
                return !indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto;

            case 'E':
                return pontos[8].y > pontos[6].y && pontos[12].y > pontos[10].y;

            case 'O':
                return pontos[8].y > pontos[5].y && pontos[12].y > pontos[9].y && polegarAfastado;

            case 'L':
                return indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto && polegarAfastado;

            case 'B':
                return indicadorAberto && medioAberto && anelarAberto && mindinhoAberto;

            case 'C':
                return pontos[8].x > pontos[6].x && pontos[4].y < pontos[1].y;

            case 'R':
                return indicadorAberto && medioAberto && Math.abs(pontos[8].x - pontos[12].x) < 0.03;

            case 'D':
                return indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto && Math.abs(pontos[8].x - pontos[12].x) > 0.05;

            case 'U':
            case 'I':
                return mindinhoAberto && !indicadorAberto && !medioAberto && !anelarAberto;

            case 'P':
                return pontos[8].y > pontos[9].y && medioAberto;

            case 'F':
            case 'S':
            case 'T':
                return !indicadorAberto && !medioAberto && polegarAfastado;

            default:
                return false;
        }
    };

    const desenharEsqueletoNoCanvas = (ctx, pontos) => {
        ctx.fillStyle = '#00ff00';
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 3;
        pontos.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x * 400, p.y * 300, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    return (
        <div style={{ position: 'relative', width: '400px', height: '320px', margin: '0 auto' }}>
            {carregandoIA && (
                <p style={{ color: '#ffcc00', fontWeight: 'bold', background: '#111', padding: '10px', borderRadius: '5px' }}>
                    🔧 Inicializar Motores de Visão Computacional Oficinal...
                </p>
            )}

            <CameraView letraAlvo={letraAlvo} onFrame={processarFrameCamera} />

            <canvas
                ref={canvasRef}
                width='400'
                height='300'
                style={{ position: 'absolute', top: 38, left: 0, zIndex: 2, pointerEvents: 'none', transform: 'scaleX(-1)' }}
            />
        </div>
    );
}*/







/*
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import CameraView from './CameraView';

// Mapeamento oficial dos pontos do MediaPipe para desenhar as linhas do esqueleto
const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],       // Polegar
    [0, 5], [5, 6], [6, 7], [7, 8],       // Indicador
    [5, 9], [9, 10], [10, 11], [11, 12],   // Médio
    [9, 13], [13, 14], [14, 15], [15, 16], // Anelar
    [13, 17], [17, 18], [18, 19], [19, 20], // Mindinho
    [0, 17]                               // Palma/Base
];

export default function GestureModel({ letraAlvo, onLetraIdentificada }) {
    const [carregandoIA, setCarregandoIA] = useState(true);
    const [bloqueioAvanco, setBloqueioAvanco] = useState(false);
    const landmarkerRef = useRef(null);
    const bloqueioRef = useRef(false);
    const timeoutRef = useRef(null);
    const canvasRef = useRef(null);

    // Guardamos referências das props para o loop não precisar de recriar funções
    const propsRef = useRef({ letraAlvo, onLetraIdentificada });
    useEffect(() => {
        propsRef.current = { letraAlvo, onLetraIdentificada };
    }, [letraAlvo, onLetraIdentificada]);

    useEffect(() => {
        async function carregarModelo() {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
                );

                const instancia = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                        delegate: 'GPU' // Mudado para GPU para maior fluidez
                    },
                    runningMode: 'VIDEO',
                    numHands: 1
                });

                landmarkerRef.current = instancia;
                setCarregandoIA(false);
            } catch (erro) {
                console.error('Erro ao instanciar o MediaPipe:', erro);
            }
        }

        carregarModelo();

        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
            if (landmarkerRef.current) landmarkerRef.current.close();
        };
    }, []);

    // useCallback estável que nunca muda de referência
    const processarFrameCamera = useCallback((videoElement) => {
        const landmarker = landmarkerRef.current;
        if (!landmarker || !videoElement || videoElement.readyState !== 4 || bloqueioRef.current) return;

        try {
            const agora = performance.now();
            const resultado = landmarker.detectForVideo(videoElement, agora);

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (resultado.handLandmarks && resultado.handLandmarks.length > 0) {
                const pontosMao = resultado.handLandmarks[0];
                
                // Desenha os pontos E as linhas
                desenharEsqueletoNoCanvas(ctx, pontosMao);

                const currentProps = propsRef.current;
                if (validarGestoLGP(pontosMao, currentProps.letraAlvo)) {
                    bloqueioRef.current = true;
                    setBloqueioAvanco(true);
                    currentProps.onLetraIdentificada();

                    timeoutRef.current = window.setTimeout(() => {
                        bloqueioRef.current = false;
                        setBloqueioAvanco(false);
                    }, 1500);
                }
            }
        } catch (err) {
            console.error("Erro no processamento do frame:", err);
        }
    }, []);

    const validarGestoLGP = (pontos, letra) => {
        if (!pontos || pontos.length < 21) return false;

        const indicadorAberto = pontos[8].y < pontos[6].y;
        const medioAberto = pontos[12].y < pontos[10].y;
        const anelarAberto = pontos[16].y < pontos[14].y;
        const mindinhoAberto = pontos[20].y < pontos[18].y;
        const polegarAfastado = Math.abs(pontos[4].x - pontos[3].x) > 0.05;

        switch (letra) {
            case 'A': return !indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto;
            case 'E': return pontos[8].y > pontos[6].y && pontos[12].y > pontos[10].y;
            case 'O': return pontos[8].y > pontos[5].y && pontos[12].y > pontos[9].y && polegarAfastado;
            case 'L': return indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto && polegarAfastado;
            case 'B': return indicadorAberto && medioAberto && anelarAberto && mindinhoAberto;
            case 'C': return pontos[8].x > pontos[6].x && pontos[4].y < pontos[1].y;
            case 'R': return indicadorAberto && medioAberto && Math.abs(pontos[8].x - pontos[12].x) < 0.03;
            case 'D': return indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto && Math.abs(pontos[8].x - pontos[12].x) > 0.05;
            case 'U':
            case 'I': return mindinhoAberto && !indicadorAberto && !medioAberto && !anelarAberto;
            case 'P': return pontos[8].y > pontos[9].y && medioAberto;
            case 'F':
            case 'S':
            case 'T': return !indicadorAberto && !medioAberto && polegarAfastado;
            default: return false;
        }
    };

    const desenharEsqueletoNoCanvas = (ctx, pontos) => {
        // 1. Desenhar as linhas de conexão (ossos do esqueleto)
        ctx.strokeStyle = '#ffcc00'; // Amarelo mecânico da oficina
        ctx.lineWidth = 4;
        HAND_CONNECTIONS.forEach(([de, para]) => {
            const ptDe = pontos[de];
            const ptPara = pontos[para];
            if (ptDe && ptPara) {
                ctx.beginPath();
                ctx.moveTo(ptDe.x * 400, ptDe.y * 300);
                ctx.lineTo(ptPara.x * 400, ptPara.y * 300);
                ctx.stroke();
            }
        });

        // 2. Desenhar as articulações (pontos verdes)
        ctx.fillStyle = '#00ff00';
        pontos.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x * 400, p.y * 300, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    return (
        <div style={{ position: 'relative', width: '400px', height: '320px', margin: '0 auto' }}>
            {carregandoIA && (
                <p style={{ color: '#ffcc00', fontWeight: 'bold', background: '#111', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                    🔧 Inicializando Motores de Visão Computacional Oficinal...
                </p>
            )}

            <CameraView letraAlvo={letraAlvo} onFrame={processarFrameCamera} />

            <canvas
                ref={canvasRef}
                width='400'
                height='300'
                style={{ position: 'absolute', top: 38, left: 0, zIndex: 2, pointerEvents: 'none', transform: 'scaleX(-1)' }}
            />
        </div>
    );
}
*/








import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import CameraView from './CameraView';

const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],       
    [0, 5], [5, 6], [6, 7], [7, 8],       
    [5, 9], [9, 10], [10, 11], [11, 12],   
    [9, 13], [13, 14], [14, 15], [15, 16], 
    [13, 17], [17, 18], [18, 19], [19, 20], 
    [0, 17]                               
];

export default function GestureModel({ letraAlvo, onLetraIdentificada }) {
    const [carregandoIA, setCarregandoIA] = useState(true);
    const [erroIA, setErroIA] = useState(null);
    const [dedosDetetados, setDedosDetetados] = useState("Nenhuma mão na câmara");
    const [bloqueioAvanco, setBloqueioAvanco] = useState(false);
    
    const landmarkerRef = useRef(null);
    const bloqueioRef = useRef(false);
    const timeoutRef = useRef(null);
    const canvasRef = useRef(null);
    const ultimoTimestampRef = useRef(-1); // Evita o crash de frames repetidos

    const propsRef = useRef({ letraAlvo, onLetraIdentificada });
    useEffect(() => {
        propsRef.current = { letraAlvo, onLetraIdentificada };
    }, [letraAlvo, onLetraIdentificada]);

    useEffect(() => {
        async function carregarModelo() {
            try {
                // Forçamos o carregamento direto dos ficheiros WASM da CDN oficial
                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
                );

                const instancia = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                        delegate: 'GPU' 
                    },
                    runningMode: 'VIDEO',
                    numHands: 1
                });

                landmarkerRef.current = instancia;
                setCarregandoIA(false);
            } catch (erro) {
                console.error('Erro ao instanciar o MediaPipe:', erro);
                setErroIA(erro.message || "Erro desconhecido ao carregar WASM/Modelo.");
                setCarregandoIA(false);
            }
        }

        carregarModelo();

        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
            if (landmarkerRef.current) landmarkerRef.current.close();
        };
    }, []);

    const processarFrameCamera = useCallback((videoElement) => {
        const landmarker = landmarkerRef.current;
        if (!landmarker || !videoElement || videoElement.readyState !== 4 || bloqueioRef.current) return;

        try {
            // CRUCIAL: O MediaPipe exige que o timestamp suba obrigatoriamente a cada frame.
            // Usar o currentTime do próprio vídeo garante sincronização perfeita.
            const timestampMilissegundos = videoElement.currentTime * 1000;
            
            if (timestampMilissegundos <= ultimoTimestampRef.current) {
                return; // Ignora se o frame do vídeo ainda não avançou
            }
            ultimoTimestampRef.current = timestampMilissegundos;

            const resultado = landmarker.detectForVideo(videoElement, timestampMilissegundos);

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (resultado.handLandmarks && resultado.handLandmarks.length > 0) {
                const pontosMao = resultado.handLandmarks[0];
                
                setDedosDetetados("✅ Mão Detetada! A analisar gesto...");
                desenharEsqueletoNoCanvas(ctx, pontosMao);

                const currentProps = propsRef.current;
                if (validarGestoLGP(pontosMao, currentProps.letraAlvo)) {
                    bloqueioRef.current = true;
                    setBloqueioAvanco(true);
                    setDedosDetetados(`🎯 Gesto Correto para a Letra ${currentProps.letraAlvo}!`);
                    currentProps.onLetraIdentificada();

                    timeoutRef.current = window.setTimeout(() => {
                        bloqueioRef.current = false;
                        setBloqueioAvanco(false);
                    }, 1500);
                }
            } else {
                setDedosDetetados("❌ Nenhuma mão visível no enquadramento");
            }
        } catch (err) {
            console.error("Erro no loop de processamento:", err);
        }
    }, []);

    const validarGestoLGP = (pontos, letra) => {
        if (!pontos || pontos.length < 21) return false;

        // Heurísticas básicas de distância e altura dos dedos
        const indicadorAberto = pontos[8].y < pontos[6].y;
        const medioAberto = pontos[12].y < pontos[10].y;
        const anelarAberto = pontos[16].y < pontos[14].y;
        const mindinhoAberto = pontos[20].y < pontos[18].y;
        const polegarAfastado = Math.abs(pontos[4].x - pontos[3].x) > 0.05;

        switch (letra) {
            case 'A': return !indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto;
            case 'E': return pontos[8].y > pontos[6].y && pontos[12].y > pontos[10].y;
            case 'O': return pontos[8].y > pontos[5].y && pontos[12].y > pontos[9].y && polegarAfastado;
            case 'L': return indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto && polegarAfastado;
            case 'B': return indicadorAberto && medioAberto && anelarAberto && mindinhoAberto;
            case 'C': return pontos[8].x > pontos[6].x && pontos[4].y < pontos[1].y;
            case 'R': return indicadorAberto && medioAberto && Math.abs(pontos[8].x - 12) < 0.05; 
            default: return !indicadorAberto; // Fallback temporário para testes se a letra não estiver mapeada
        }
    };

    const desenharEsqueletoNoCanvas = (ctx, pontos) => {
        // Linhas amareladas da oficina
        ctx.strokeStyle = '#ffcc00'; 
        ctx.lineWidth = 4;
        HAND_CONNECTIONS.forEach(([de, para]) => {
            const ptDe = pontos[de];
            const ptPara = pontos[para];
            if (ptDe && ptPara) {
                ctx.beginPath();
                ctx.moveTo(ptDe.x * 400, ptDe.y * 300);
                ctx.lineTo(ptPara.x * 400, ptPara.y * 300);
                ctx.stroke();
            }
        });

        // Pontos das articulações
        ctx.fillStyle = '#00ff00';
        pontos.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x * 400, p.y * 300, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    return (
        <div style={{ position: 'relative', width: '400px', margin: '0 auto' }}>
            
            {/* PAINEL DE DIAGNÓSTICO DA OFICINA */}
            <div style={{ background: '#111', color: '#aaa', padding: '10px', borderRadius: '5px', marginBottom: '10px', fontSize: '12px', fontFamily: 'monospace' }}>
                <div><strong>Status do Motor IA:</strong> {carregandoIA ? "⚙️ A carregar..." : (erroIA ? "❌ Erro" : "🟢 Pronto")}</div>
                <div><strong>Visão Mecânica:</strong> {dedosDetetados}</div>
                {erroIA && <div style={{ color: '#ff4444', marginTop: '5px' }}><strong>Erro:</strong> {erroIA}</div>}
            </div>

            <div style={{ position: 'relative', width: '400px', height: '300px' }}>
                <CameraView letraAlvo={letraAlvo} onFrame={processarFrameCamera} />

                <canvas
                    ref={canvasRef}
                    width='400'
                    height='300'
                    style={{ position: 'absolute', top: 38, left: 0, zIndex: 2, pointerEvents: 'none', transform: 'scaleX(-1)' }}
                />
            </div>
        </div>
    );
}