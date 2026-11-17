chai.Assertion.addMethod('beClickable', function () {
    const subject = this._obj;
    this.assert(
        subject.is(':visible') && !subject.is(':disabled'),
        'expected #{this} to be clickable',
        'expected #{this} not to be clickable',
        subject
    );
});

chai.Assertion.addMethod('inViewport', function (ER) {
    const subject = this._obj;
    const element = subject.get(0);
    // window of the element, so viewport changes (cy.viewport) and frames are respected
    const view = element.ownerDocument.defaultView;
    const bounding = element.getBoundingClientRect();
    const condition = bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <= view.innerWidth &&
        bounding.bottom <= view.innerHeight;

    this.assert(
        condition,
        'expected #{this} to be in viewport',
        'expected #{this} not to be in viewport',
        ER,
        subject
    );
});

export const conditionValidations = {
    PRESENT: 'present',
    CLICKABLE: 'clickable',
    VISIBLE: 'visible',
    INVISIBLE: 'invisible',
    HIDDEN: 'hidden',
    ENABLED: 'enabled',
    DISABLED: 'disabled',
    IN_VIEWPORT: 'in viewport'
};

const notClause = '(not )?';
const toBeClause = 'to (?:be )?';
const validationClause = `(${Object.values(conditionValidations).join('|')})`;

export const conditionWaitExtractRegexp = new RegExp(`^${notClause}${toBeClause}${validationClause}$`);
export const conditionWaitRegexp = new RegExp(`(${notClause}${toBeClause}${validationClause})`);

const expects = {
    [conditionValidations.PRESENT]: 'exist',
    [conditionValidations.CLICKABLE]: 'beClickable',
    [conditionValidations.VISIBLE]: 'be.visible',
    [conditionValidations.INVISIBLE]: 'be.hidden',
    [conditionValidations.HIDDEN]: 'be.hidden',
    [conditionValidations.ENABLED]: 'be.enabled',
    [conditionValidations.DISABLED]: 'be.disabled',
    [conditionValidations.IN_VIEWPORT]: 'inViewport'
};

const not = (reverse) => reverse ? 'not.' : '';

/**
 * Convert condition step parameter to chai chainer
 * @param {string} condition - condition, e.g. 'not to be visible'
 * @return {string} - chainer, e.g. 'not.be.visible'
 */
export function getConditionExpect(condition) {
    const match = condition.match(conditionWaitExtractRegexp);
    if (!match) throw new Error(`${condition} wait is not implemented`);
    const [, reverse, validation] = match;
    return not(reverse) + expects[validation];
}

/**
 * Run chai chainer (result of getConditionExpect) against element
 * @param {JQuery} $el - element
 * @param {string} chainer - chainer, e.g. 'not.be.visible'
 */
export function assertCondition($el, chainer) {
    const path = chainer.split('.');
    const last = path.pop();
    let assertion = expect($el).to;
    for (const word of path) {
        assertion = assertion[word];
    }
    // property assertions (visible, exist, ...) run on access, method assertions (beClickable, inViewport) on call
    const result = assertion[last];
    if (typeof result === 'function') result.call(assertion);
}
