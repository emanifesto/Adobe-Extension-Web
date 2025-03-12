const pricing_table = document.querySelector('stripe-pricing-table')

const changeDetector = new MutationObserver((changes) => {
    changes.forEach(change => {
            changeDetector.disconnect()
            pricing_table.setAttribute(change.attributeName, change.oldValue)
            changeDetector.observe(pricing_table, {attributeFilter: ["client-reference-id", 'customer-session-client-secret'], attributeOldValue: true,})
    })
})

setTimeout(function(){
    Object.freeze(pricing_table)
}, 4000)
changeDetector.observe(pricing_table, {attributeFilter: ["client-reference-id", 'customer-session-client-secret'], attributeOldValue: true,})