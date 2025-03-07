export const onRequestGet = ({request}) => {
    const body = request.json()
    const auth = request.headers.get('Authorization')
    const asmaID = auth.split(' ')[1]

    
    return new Response(null)
}