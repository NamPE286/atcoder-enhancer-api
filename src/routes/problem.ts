import express from 'express'

const router = express.Router()

async function fetchProblemTags(problemID: string) {
    const res = await fetch(`https://atcoder-tags.herokuapp.com/check/${problemID}`)
    const htmlText = await res.text()
    let objText: string = ''

    for (let i = htmlText.indexOf("var dict = JSON.parse('{") + 23; i < htmlText.indexOf("var labels = ") + 1000; i++) {
        objText += htmlText[i]

        if (htmlText[i] == '}') {
            break
        }
    }

    let obj = JSON.parse(objText)
    let tags = []

    for (const i in obj) {
        if (obj[i] != 0) {
            tags.push(i)
        }
    }

    return tags
}

router.route('/:id/tags')
    .get(async (req, res) => {
        const { id } = req.params

        try {
            res.send(await fetchProblemTags(id))
        } catch {
            res.status(404).send()
        }
    })

export default router