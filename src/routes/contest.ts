import express from 'express'
import { dbx } from '../dropbox'

const router = express.Router()

async function fetchDropboxFile(path: string) {
    const a = 'https://www.dropbox.com/sh/nx3tnilzqz7df8a/AAAYlTq2tiEHl5hsESw6-yfLa?e=3&dl=0'
    const res = await dbx.sharingGetSharedLinkFile({
        path: path,
        url: "https://www.dropbox.com/sh/nx3tnilzqz7df8a/AAAYlTq2tiEHl5hsESw6-yfLa?e=3&dl=0"
    })
    // @ts-ignore
    const fileContent: string = res.result.fileBinary.toString()

    return fileContent
}

router.route('/:contest/:problem/testcase/:testcase')
    .get(async (req, res) => {
        const { contest, problem, testcase } = req.params

        try {
            const input = await fetchDropboxFile(`/${contest}/${problem.toUpperCase()}/in/${testcase}`)
            const output = await fetchDropboxFile(`/${contest}/${problem.toUpperCase()}/out/${testcase}`)

            res.send({ in: input, out: output })
        } catch {
            console.log("b")
            try {
                const input = await fetchDropboxFile(`/${contest.toUpperCase()}/${problem.toUpperCase()}/in/${testcase}`)
                const output = await fetchDropboxFile(`/${contest.toUpperCase()}/${problem.toUpperCase()}/out/${testcase}`)

                res.send({ in: input, out: output })
            } catch {
                res.status(404).send()
            }
        }
    })

export default router