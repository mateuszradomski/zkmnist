fn main(x: Field) {
    assert(x + x == 4);
}

#[test]
fn test_main() {
    main(2);
}
