chai.Assertion.addMethod('inViewport', function (ER) {
    const subject = this._obj;

    const windowInnerWidth = Cypress.config(`viewportWidth`);
    const windowInnerHeight = Cypress.config(`viewportHeight`);

    const bounding = subject.get(0).getBoundingClientRect();
    const condition = bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <= windowInnerWidth &&
        bounding.bottom <= windowInnerHeight

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
    VISIBLE: 'visible',
    INVISIBLE: 'invisible',
    ENABLED: 'enabled',
    DISABLED: 'disabled',
    IN_VIEWPORT: 'in viewport',
}

const notClause = '(not )?';
const toBeClause = 'to (?:be )?';
const validationClause = `(${Object.values(conditionValidations).join('|')})`;

export const conditionWaitExtractRegexp = new RegExp(`^${notClause}${toBeClause}${validationClause}$`);
export const conditionWaitRegexp = new RegExp(`(${notClause}${toBeClause}${validationClause})`);

const expects = {
    [conditionValidations.PRESENT]: 'exist',
    [conditionValidations.VISIBLE]: 'be.visible',
    [conditionValidations.INVISIBLE]: 'be.hidden',
    [conditionValidations.ENABLED]: 'be.enabled',
    [conditionValidations.DISABLED]: 'be.disabled',
    [conditionValidations.IN_VIEWPORT]: 'inViewport',
}

const not = (reverse) => reverse ? 'not.' : '';

export function getConditionExpect(condition) {
    const match = condition.match(conditionWaitExtractRegexp);
    if (!match) throw new Error(`${condition} wait is not implemented`);
    const [ _, reverse, validation ] = match;
    return not(reverse) + expects[validation];
}
