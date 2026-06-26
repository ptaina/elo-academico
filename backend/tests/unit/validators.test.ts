import { isValidCPF, isValidEmail, isNotEmpty, isValidISSN } from '../../src/utils/validators';

// Testes unitários dos validadores — requisito da rubrica (2 tipos de teste)
describe('Validadores — testes unitários', () => {

  // ── CPF ──────────────────────────────────────────────────────────────────────
  describe('isValidCPF', () => {
    it('deve retornar true para um CPF válido', () => {
      expect(isValidCPF('529.982.247-25')).toBe(true);
      expect(isValidCPF('52998224725')).toBe(true);
    });

    it('deve retornar false para CPF com todos os dígitos iguais', () => {
      expect(isValidCPF('111.111.111-11')).toBe(false);
      expect(isValidCPF('000.000.000-00')).toBe(false);
    });

    it('deve retornar false para CPF com dígito verificador incorreto', () => {
      expect(isValidCPF('529.982.247-26')).toBe(false);
    });

    it('deve retornar false para CPF com tamanho errado', () => {
      expect(isValidCPF('123.456.789')).toBe(false);
      expect(isValidCPF('')).toBe(false);
    });
  });

  // ── Email ─────────────────────────────────────────────────────────────────────
  describe('isValidEmail', () => {
    it('deve retornar true para e-mails válidos', () => {
      expect(isValidEmail('usuario@exemplo.com.br')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.org')).toBe(true);
    });

    it('deve retornar false para e-mails sem @', () => {
      expect(isValidEmail('usuariodomain.com')).toBe(false);
    });

    it('deve retornar false para e-mails sem domínio', () => {
      expect(isValidEmail('usuario@')).toBe(false);
    });

    it('deve retornar false para e-mail vazio', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  // ── Campo vazio ───────────────────────────────────────────────────────────────
  describe('isNotEmpty', () => {
    it('deve retornar true para string com conteúdo', () => {
      expect(isNotEmpty('texto')).toBe(true);
    });

    it('deve retornar false para string vazia ou apenas espaços', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
    });

    it('deve retornar false para null e undefined', () => {
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
    });
  });

  // ── ISSN ──────────────────────────────────────────────────────────────────────
  describe('isValidISSN', () => {
    it('deve retornar true para ISSN válido com dígito numérico', () => {
      // Exemplo do enunciado: 1678-0817
      expect(isValidISSN('1678-0817')).toBe(true);
    });

    it('deve retornar true para ISSN válido com dígito X', () => {
      // ISSN com dígito verificador X
      expect(isValidISSN('0378-5955')).toBe(true);
    });

    it('deve retornar false para ISSN com formato errado', () => {
      expect(isValidISSN('16780817')).toBe(false);
      expect(isValidISSN('1678-081')).toBe(false);
      expect(isValidISSN('')).toBe(false);
    });

    it('deve retornar false para ISSN com dígito verificador incorreto', () => {
      expect(isValidISSN('1678-0816')).toBe(false);
    });
  });
});
