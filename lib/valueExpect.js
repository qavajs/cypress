chai.Assertion.addMethod('notStrictEqual', function (ER) {
    const obj = this._obj;

    this.assert(
        obj == ER,
        'expected #{this} to equal #{exp}',
        'expected #{this} to not equal #{exp}',
        ER,
        obj
    );
});

export const validations = {
    EQUAL: 'equal',
    DEEPLY_EQUAL: 'deeply equal',
    STRICTLY_EQUAL: 'strictly equal',
    HAVE_MEMBERS: 'have member',
    MATCH: 'match',
    CONTAIN: 'contain',
    ABOVE: 'above',
    BELOW: 'below',
    GREATER: 'greater than',
    LESS: 'less than',
    HAVE_TYPE: 'have type',
    INCLUDE_MEMBERS: 'include member',
    HAVE_PROPERTY: 'have property'
};

const isClause = '(?:is |do |does |to )?';
const notClause = '(?<reverse>not |to not )?';
const toBeClause = '(?:to )?(?:be )?';
const validationClause = `(?:(?<validation>${Object.values(validations).join('|')})(?:s|es)?)`;

export const validationExtractRegexp = new RegExp(`^${isClause}${notClause}${toBeClause}${validationClause}$`);
export const validationRegexp = new RegExp(`(${isClause}${notClause}${toBeClause}${validationClause})`);

const aboveFn = (expectClause, ER) => expectClause.above(toNumber(ER));
const belowFn = (expectClause, ER) => expectClause.below(toNumber(ER));
const validationFns = {
    [validations.EQUAL]: (expectClause, ER) => expectClause.notStrictEqual(ER),
    [validations.STRICTLY_EQUAL]: (expectClause, ER) => expectClause.equal(ER),
    [validations.DEEPLY_EQUAL]: (expectClause, ER) => expectClause.eql(ER),
    [validations.HAVE_MEMBERS]: (expectClause, ER) => expectClause.have.members(ER),
    [validations.MATCH]: (expectClause, ER) => expectClause.match(toRegexp(ER)),
    [validations.CONTAIN]: (expectClause, ER) => expectClause.contain(ER),
    [validations.ABOVE]: aboveFn,
    [validations.BELOW]: belowFn,
    [validations.GREATER]: aboveFn,
    [validations.LESS]: belowFn,
    [validations.HAVE_TYPE]: (expectClause, ER) => expectClause.a(ER),
    [validations.INCLUDE_MEMBERS]: (expectClause, ER) => expectClause.include.members(ER),
    [validations.HAVE_PROPERTY]: (expectClause, ER) => expectClause.have.property(ER),
};

/**
 * Basic verification function
 * @param {Object} object with all needed data for validation
 */
export function verify({ AR, ER, validation, reverse }) {
    const expectClause = reverse ? expect(AR).to.not : expect(AR).to;
    const validate = validationFns[validation];
    validate(expectClause, ER);
}

export function getValidation(validationType) {
    const match = validationExtractRegexp.exec(validationType);
    if (!match) throw new Error(`validation '${validationType}' is not supported`);
    const { reverse, validation } = match.groups;
    return function (AR, ER) {
        verify({ AR, ER, validation, reverse: Boolean(reverse) });
    };
}

function toNumber(n) {
    const parsedNumber = parseFloat(n);
    if (Number.isNaN(parsedNumber)) {
        throw new Error(`${n} is not a number`);
    }
    return parsedNumber
}

function toRegexp(r) {
    return r instanceof RegExp ? r : RegExp(r)
}
