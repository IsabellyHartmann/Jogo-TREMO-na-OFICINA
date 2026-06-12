/*import React, { useRef, useEffect, useState } from 'react';

export default function CameraView({ letraAlvo, onFrame }) {
    const videoRef = useRef(null);
    const [status, setStatus] = useState("A iniciar câmara...");

    useEffect(() => {
        let ativo = true;
        let idAnimacao;

        async function iniciarVideo() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 400, height: 300, facingMode: "user" }
                });
                if (videoRef.current && ativo) {
                    videoRef.current.srcObject = stream;
                    setStatus(`Faça o gesto para a letra: ${letraAlvo}`);

                    // Inicia o loop contínuo de captura e análise de imagem
                    const loop = () => {
                        if (videoRef.current) {
                            onFrame(videoRef.current);
                        }
                        idAnimacao = requestAnimationFrame(loop);
                    };
                    loop();
                }
            } catch (err) {
                setStatus("Erro: Permita o acesso à câmara nas definições.");
            }
        }

        iniciarVideo();

        return () => {
            ativo = false;
            cancelAnimationFrame(idAnimacao);
        };
    }, [letraAlvo, onFrame]);

    return (
        <div>
            <p style={{ fontWeight: 'bold', margin: '8px 0' }}>{status}</p>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width="400"
                height="300"
                style={{ borderRadius: '12px', transform: 'scaleX(-1)', border: '4px solid #333', backgroundColor: '#000' }}
            />
        </div>
    );
}*/








/*import React, { useRef, useEffect, useState } from 'react';

export default function CameraView({ letraAlvo, onFrame }) {
    const videoRef = useRef(null);
    const [status, setStatus] = useState("A iniciar câmara...");
    const onFrameRef = useRef(onFrame);

    // Mantém a função de processamento atualizada sem quebrar o loop
    useEffect(() => {
        onFrameRef.current = onFrame;
    }, [onFrame]);

    // Atualiza o texto do status sempre que a letra alvo mudar, sem reiniciar a câmara
    useEffect(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            setStatus(`Faça o gesto para a letra: ${letraAlvo}`);
        }
    }, [letraAlvo]);

    useEffect(() => {
        let ativo = true;
        let idAnimacao;
        let streamLocal = null;

        async function iniciarVideo() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 400, height: 300, facingMode: "user" }
                });
                
                if (videoRef.current && ativo) {
                    videoRef.current.srcObject = stream;
                    streamLocal = stream;
                    setStatus(`Faça o gesto para a letra: ${letraAlvo}`);

                    // Loop contínuo e estável de captura
                    const loop = () => {
                        if (videoRef.current && videoRef.current.readyState === 4) {
                            onFrameRef.current(videoRef.current);
                        }
                        idAnimacao = requestAnimationFrame(loop);
                    };
                    loop();
                }
            } catch (err) {
                setStatus("Erro: Permita o acesso à câmara nas definições.");
            }
        }

        iniciarVideo();

        return () => {
            ativo = false;
            cancelAnimationFrame(idAnimacao);
            if (streamLocal) {
                streamLocal.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // Array vazio garante que a câmara liga apenas UMA vez

    return (
        <div>
            <p style={{ fontWeight: 'bold', margin: '8px 0', textAlign: 'center' }}>{status}</p>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width="400"
                height="300"
                style={{ borderRadius: '12px', transform: 'scaleX(-1)', border: '4px solid #333', backgroundColor: '#000' }}
            />
        </div>
    );
}*/







import React, { useRef, useEffect, useState } from 'react';

export default function CameraView({ letraAlvo, onFrame, children }) {
    const videoRef = useRef(null);
    const [status, setStatus] = useState("A iniciar câmara no iPhone...");
    const onFrameRef = useRef(onFrame);

    useEffect(() => {
        onFrameRef.current = onFrame;
    }, [onFrame]);

    useEffect(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            setStatus(`Faça o gesto para a letra: ${letraAlvo}`);
        }
    }, [letraAlvo]);

    useEffect(() => {
        let ativo = true;
        let streamLocal = null;
        let idAnimacao;

        async function iniciarVideo() {
            try {
                // Configuração ideal e leve para câmaras de telemóveis
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: "user"
                    }
                });

                if (!ativo) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamLocal = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    // CRUCIAL PARA IPHONE: Forçar o arranque do play via código
                    try {
                        await videoRef.current.play();
                    } catch (e) {
                        console.log("A aguardar toque do utilizador para iniciar vídeo.");
                    }

                    setStatus(`Faça o gesto para a letra: ${letraAlvo}`);

                    const loop = () => {
                        if (videoRef.current && videoRef.current.readyState === 4 && ativo) {
                            onFrameRef.current(videoRef.current);
                        }
                        if (ativo) {
                            idAnimacao = requestAnimationFrame(loop);
                        }
                    };
                    loop();
                }
            } catch (err) {
                if (ativo) {
                    console.error("Erro na câmara do iPhone:", err);
                    setStatus(`Erro: ${err.name === 'NotAllowedError' ? 'Permita o acesso à câmara no iOS.' : err.message}`);
                }
            }
        }

        iniciarVideo();

        return () => {
            ativo = false;
            cancelAnimationFrame(idAnimacao);
            if (streamLocal) {
                streamLocal.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold', margin: '8px 0', color: '#ffcc00', fontSize: '14px' }}>{status}</p>

            {/* Se o iPhone bloquear o autoplay, um toque aqui força o início */}
            <div
                onClick={() => videoRef.current && videoRef.current.play()}
                style={{ position: 'relative', width: '400px', height: '300px', margin: '0 auto', cursor: 'pointer' }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    width="400"
                    height="300"
                    style={{
                        borderRadius: '12px',
                        transform: 'scaleX(-1)',
                        border: '4px solid #333',
                        backgroundColor: '#000',
                        display: 'block',
                        objectFit: 'cover'
                    }}
                />
                {children}
            </div>
            <p style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>Se a imagem congelar, dá um toque no quadrado do vídeo.</p>
        </div>
    );
}