$(document).ready(() => {
    ($('.repeater') as any).repeater({
        initEmpty: false,
        defaultValues: {
            'text-input': ''
        },
        show: function(this: HTMLElement) {
            $(this).slideDown();
        },
        hide: function(this: HTMLElement, deleteElement: () => void) {
            $(this).slideUp(deleteElement);
            setTimeout(() => {
                generateCV();
            }, 500);
        },
        isFirstItemUndeletable: true
    });
});

// declare function generateCV(): void;
