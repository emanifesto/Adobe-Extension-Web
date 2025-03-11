const pricing_table = document.querySelector('stripe-pricing-table')
// Object.freeze(pricing_table)

const changeDetector = new MutationObserver((changes) => {
    changes.forEach(change => {
            pricing_table.setAttribute(change.attributeName, change.oldValue)
    })
})

setTimeout(Object.freeze(pricing_table), 4000)
changeDetector.observe(pricing_table, {attributeFilter: ["client-referece-id", 'customer-session-client-secret'], attributeOldValue: true,})