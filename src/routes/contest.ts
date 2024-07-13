import express from 'express'

const router = express.Router()

async function fetchDropboxFile(path: string) {
    const res = await fetch('https://content.dropboxapi.com/2/sharing/get_shared_link_file', {
        headers: {
            Authorization: "Bearer " + process.env.DROPBOX_API_KEY,
            "Dropbox-API-Arg": JSON.stringify({
                path: path,
                url: "https://www.dropbox.com/sh/nx3tnilzqz7df8a/AAAYlTq2tiEHl5hsESw6-yfLa?e=3&dl=0"
            })
        }
    })

    if (!res.ok) {
        throw new Error("File not found")
    }

    return await res.text()
}

router.route('/:contest/:problem/testcase/:testcase')
    .get(async (req, res) => {
        const { contest, problem, testcase } = req.params

        try {
            const input = await fetchDropboxFile(`/${contest}/${problem}/in/${testcase}`)
            const output = await fetchDropboxFile(`/${contest}/${problem}/out/${testcase}`)

            res.send({ in: input, out: output })
        } catch {
            res.status(404).send()
        }
    })

export default router