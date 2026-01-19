$(document).ready(function () {
    const N = 4;
    let currentStep = 1;
    const $gameBoard = $('#game-board');
    const $doneBtn = $('#done-btn');

    renderStep(currentStep);

    function renderStep(step) {
        if (step > 10) return;

        const equationHtml = `
            <div class="task-board__equation-row" data-row-step="${step}">
                ${N} × ${step} = 
                <input type="number" 
                       class="task-board__equation-input" 
                       data-step="${step}" 
                       autocomplete="off">
            </div>
        `;

        const $cubeRow = $(`<div class="task-board__cube-row" data-cube-step="${step}"></div>`);

        $gameBoard.append(equationHtml);
        $gameBoard.append($cubeRow);

        const $input = $(`.task-board__equation-input[data-step="${step}"]`);
        $input.focus();

        for (let i = 0; i < N; i++) {
            const cubeHtml = '<div class="task-board__cube"></div>';
            $cubeRow.append(cubeHtml);
        }

        setTimeout(() => {
            $cubeRow.find('.task-board__cube').addClass('visible');
        }, 500);

        updateButtonState();
    }

    $(document).on('input', '.task-board__equation-input', function () {
        const step = $(this).data('step');

        if (parseInt(step) !== currentStep) return;

        updateButtonState();
    });

    $(document).on('keypress', '.task-board__equation-input', function (e) {
        if (e.which == 13) {
            if (!$doneBtn.prop('disabled')) {
                $doneBtn.click();
            }
        }
    });

    function updateButtonState() {
        const $input = $(`.task-board__equation-input[data-step="${currentStep}"]`);
        const val = $input.val();

        if (val && val.trim() !== '') {
            $doneBtn.prop('disabled', false).addClass('active').removeClass('disabled');
        } else {
            $doneBtn.prop('disabled', true).removeClass('active').addClass('disabled');
        }

        $doneBtn.removeClass('wrong right');
        $input.removeClass('error');
    }

    $doneBtn.on('click', function () {
        if ($(this).prop('disabled')) return;

        const $input = $(`.task-board__equation-input[data-step="${currentStep}"]`);
        const userVal = parseInt($input.val());
        const correctVal = N * currentStep;

        if (userVal === correctVal) {
            handleCorrect($input);
        } else {
            handleError($input);
        }
    });

    function handleCorrect($input) {
        $doneBtn.removeClass('active wrong').addClass('right');
        $input.addClass('success-active');

        $input.prop('disabled', true);

        setTimeout(() => {
            const val = $input.val();
            const $parent = $input.parent();

            $parent.html(`<span>${N} × ${currentStep} = ${val}</span>`);

            currentStep++;

            if (currentStep <= 10) {
                renderStep(currentStep);

                const $nextInput = $(`.task-board__equation-input[data-step="${currentStep}"]`);
                if ($nextInput.length) {
                    $nextInput[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } else {
                $doneBtn.prop('disabled', true).removeClass('active right').text('Finished');
            }
        }, 1000);
    }

    function handleError($input) {
        $doneBtn.removeClass('active').addClass('wrong');
        $input.addClass('error');

        setTimeout(() => {
            $doneBtn.removeClass('wrong').addClass('active');
            $input.removeClass('error');
            $input.focus();
        }, 1000);
    }
});