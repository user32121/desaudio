// const volume = 1;
const duration = 1;
const sample_rate = 10000;
const repetitions = 1;

const audio_var = 't_{desaudio}';

Calc.HelperExpression({ latex: `${audio_var}=\\frac{\\left[1...${duration * sample_rate}\\right]}{${sample_rate}}` });

const audio_context = new AudioContext({ sampleRate: sample_rate });

function play_audio(id) {
    const data = new Float32Array(Calc.expressionAnalysis[id].evaluation.value);
    const buffer = audio_context.createBuffer(1, data.length * repetitions, sample_rate);
    for (let i = 0; i < repetitions; ++i) {
        buffer.copyToChannel(data, 0, i * data.length);
    }
    // console.log(buffer.getChannelData(0));
    const source = audio_context.createBufferSource();
    source.buffer = buffer;
    source.connect(audio_context.destination);
    source.start();
}

function updatePlayButtons() {
    for (const expr of Calc.getExpressions()) {
        const row = document.querySelector(`[expr-id="${expr.id}"]`);
        if (!row) {
            continue;
        }
        const div = row.querySelector('.desaudio-play-btn');
        //check it is an evaluatable expression
        if (Calc.expressionAnalysis[expr.id]?.evaluation?.type == 'ListOfNumber') {
            if (!div) {
                //add play button
                const new_div = document.createElement('div');
                new_div.classList.add('dcg-top-level-icon', 'dcg-tappable', 'desaudio-play-btn');
                new_div.style.right = '32px';
                new_div.textContent = '\u25B6';
                new_div.onclick = () => play_audio(expr.id);
                row.querySelector('.dcg-fade-container')?.appendChild(new_div);
            }
        } else {
            if (div) {
                //remove play button
                div.parentElement.removeChild(div);
            }
        }
    }
}

Calc.observe('expressionAnalysis', updatePlayButtons);
Calc.observe('selectedExpressionId', updatePlayButtons);
