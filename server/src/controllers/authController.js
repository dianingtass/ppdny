const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
    const { nip, nama, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Password and confirm password do not match' });
    }

    try {
        const existingUser = await prisma.users.findUnique({ where: { nip } });
        if (existingUser) return res.status(400).json({ message: 'NIS already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: { nip, nama, password: hashedPassword }
        });

        res.status(201).json({ id: user.id, nip: user.nip });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { nip, password } = req.body;
    try {
        const user = await prisma.users.findUnique({ where: { nip } });
        if (!user) return res.status(401).json({ message: 'Invalid NIS' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
